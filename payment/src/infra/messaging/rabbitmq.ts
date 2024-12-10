import amqplib, { Channel, Connection } from 'amqplib';
import { env } from '../../config/env';

export class RabbitMQService {
  private static instance: RabbitMQService;
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private connecting: Promise<void> | null = null;

  private constructor() {}

  public static getInstance(): RabbitMQService {
    if (!RabbitMQService.instance) {
      RabbitMQService.instance = new RabbitMQService();
    }
    return RabbitMQService.instance;
  }

  async connect(): Promise<void> {
    // If already connecting, wait for that connection to complete
    if (this.connecting) {
      await this.connecting;
      return;
    }

    // If already connected, return
    if (this.channel && this.connection) {
      return;
    }

    try {
      this.connecting = (async () => {
        this.connection = await amqplib.connect(env.RABBITMQ_URL);
        this.channel = await this.connection.createChannel();

        // Ensure the exchange exists
        await this.channel.assertExchange('payment_events', 'topic', {
          durable: true,
        });

        // Setup connection error handlers
        this.connection.on('error', err => {
          console.error('RabbitMQ connection error:', err);
          this.resetConnection();
        });

        this.connection.on('close', () => {
          console.log('RabbitMQ connection closed');
          this.resetConnection();
        });

        console.log('Successfully connected to RabbitMQ');
      })();

      await this.connecting;
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      this.resetConnection();
      throw error;
    } finally {
      this.connecting = null;
    }
  }

  private resetConnection(): void {
    this.channel = null;
    this.connection = null;
    this.connecting = null;
  }

  async publishPaymentCompleted(orderId: string): Promise<void> {
    // Auto-connect if not connected
    if (!this.channel || !this.connection) {
      await this.connect();
    }

    if (!this.channel) {
      throw new Error('Failed to establish RabbitMQ connection');
    }

    const message = {
      order_id: orderId,
      status: 'COMPLETED',
      timestamp: new Date().toISOString(),
    };

    try {
      await this.channel.publish(
        'payment_events',
        'payment.completed',
        Buffer.from(JSON.stringify(message)),
        { persistent: true },
      );

      console.log('Published payment completed event:', message);
    } catch (error) {
      console.error('Error publishing message:', error);
      this.resetConnection(); // Reset connection on publish error
      throw error;
    }
  }

  async close(): Promise<void> {
    try {
      await this.channel?.close();
      await this.connection?.close();
      this.resetConnection();
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
      throw error;
    }
  }
}
