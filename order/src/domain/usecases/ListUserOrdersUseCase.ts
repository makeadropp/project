import { Order } from '../entities/Order';
import { OrderRepository } from '../repositories/OrderRepository';

export class ListUserOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(userId: string): Promise<Order[]> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    return this.orderRepository.findByUserId(userId);
  }
}
