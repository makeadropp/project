import { Order } from '../entities/Order';
import { OrderStatus } from '../enums/OrderStatus';
import { OrderRepository } from '../repositories/OrderRepository';

interface UpdateOrderDTO {
  id: string;
  status?: OrderStatus;
  estimatedDeliveryDate?: Date;
}

export class UpdateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({
    id,
    status,
    estimatedDeliveryDate,
  }: UpdateOrderDTO): Promise<Order> {
    if (!id) {
      throw new Error('Order ID is required');
    }

    const existingOrder = await this.orderRepository.findById(id);
    if (!existingOrder) {
      throw new Error('Order not found');
    }

    // Update status if provided
    if (status) {
      existingOrder.updateStatus(status);
    }

    // Update estimated delivery date if provided
    if (estimatedDeliveryDate) {
      existingOrder.setEstimatedDeliveryDate(estimatedDeliveryDate);
    }

    return this.orderRepository.update(existingOrder);
  }
}
