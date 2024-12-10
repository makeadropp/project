import { Order } from '../entities/Order';
import { OrderStatus } from '../enums/OrderStatus';
import { OrderRepository } from '../repositories/OrderRepository';

interface UpdateOrderDTO {
  id: string;
  status: OrderStatus;
}

export class UpdateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({ id, status }: UpdateOrderDTO): Promise<Order> {
    console.log('Updating order status:', id, status);
    if (!id) {
      throw new Error('Order ID is required');
    }

    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      throw new Error('Order not found');
    }

    existingOrder.updateStatus(status);

    return this.orderRepository.update(existingOrder);
  }
}
