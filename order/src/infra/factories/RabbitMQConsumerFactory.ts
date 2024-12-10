import { RabbitMQConsumer } from '../messaging/rabbitmq';
import { OrderFactory } from './OrderFactory';

export class RabbitMQConsumerFactory {
  static create(): RabbitMQConsumer {
    const updateOrderUseCase = OrderFactory.makeUpdateOrderUseCase();
    return new RabbitMQConsumer(updateOrderUseCase);
  }
}
