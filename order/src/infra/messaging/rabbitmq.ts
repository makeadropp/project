import { env } from '@/config/env';
import amqp from 'amqplib';
import { OrderStatus } from '../../domain/enums/OrderStatus';
import { UpdateOrderUseCase } from '../../domain/usecases/UpdateOrderUseCase';

export class RabbitMQConsumer {
  private connection: amqp.Connection | null = null;
  private channel: amqp.Channel | null = null;

  constructor(private readonly updateOrderUseCase: UpdateOrderUseCase) {}

  async connect(): Promise<void> {
    try {
      this.connection = await amqp.connect(env.RABBITMQ_URL);
      this.channel = await this.connection.createChannel();

      // Ensure the exchange exists
      await this.channel.assertExchange('payment_events', 'topic', {
        durable: true,
      });

      // Create a queue for order service
      const { queue } = await this.channel.assertQueue(
        'order_payment_completed',
        {
          durable: true,
        },
      );

      // Bind the queue to the exchange with the specific routing key
      await this.channel.bindQueue(
        queue,
        'payment_events',
        'payment.completed',
      );

      // Start consuming messages
      await this.channel.consume(queue, async msg => {
        if (!msg) return;

        try {
          const content = await JSON.parse(msg.content.toString());
          console.log('Received payment completed event:', content);

          // Update order status to IN_TRANSIT
          await this.updateOrderUseCase.execute({
            id: content.order_id,
            status: OrderStatus.IN_TRANSIT,
          });

          // Acknowledge the message
          this.channel?.ack(msg);
        } catch (error) {
          console.error('Error processing payment completed event:', error);
          // Reject the message and requeue it
          this.channel?.nack(msg, false, true);
        }
      });

      console.log(
        'RabbitMQ Consumer connected and listening for payment events',
      );
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
    } catch (error) {
      console.error('Error disconnecting from RabbitMQ:', error);
      throw error;
    }
  }
}
