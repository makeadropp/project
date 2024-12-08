import { Order } from '../entities/Order';
import { OrderRepository } from '../repositories/OrderRepository';

export class GetOrderByIdUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(id: string): Promise<Order> {
    if (!id) {
      throw new Error('Order ID is required');
    }

    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }
}
