import { Order } from '../entities/Order';
import { TransportType } from '../enums/TransportType';
import { OrderRepository } from '../repositories/OrderRepository';

interface CreateOrderDTO {
  userId: string;
  pickupAddressId: string;
  deliveryAddressId: string;
  transportType?: TransportType;
}

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({
    userId,
    pickupAddressId,
    deliveryAddressId,
    transportType,
  }: CreateOrderDTO): Promise<Order> {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!pickupAddressId) {
      throw new Error('Pickup address ID is required');
    }

    if (!deliveryAddressId) {
      throw new Error('Delivery address ID is required');
    }

    const order = Order.create(
      userId,
      pickupAddressId,
      deliveryAddressId,
      transportType,
    );

    return this.orderRepository.create(order);
  }
}
