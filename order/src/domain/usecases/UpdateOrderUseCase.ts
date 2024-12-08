import { Order } from '../entities/Order';
import { OrderStatus } from '../enums/OrderStatus';
import { TransportType } from '../enums/TransportType';
import { OrderRepository } from '../repositories/OrderRepository';

interface UpdateOrderDTO {
  id: string;
  pickupAddressId?: string;
  deliveryAddressId?: string;
  transportType?: TransportType;
  status?: OrderStatus;
  estimatedDeliveryDate?: Date;
}

export class UpdateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({
    id,
    pickupAddressId,
    deliveryAddressId,
    transportType,
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

    // Update addresses if provided
    if (pickupAddressId || deliveryAddressId) {
      existingOrder.updateAddresses(
        pickupAddressId || existingOrder.pickupAddressId,
        deliveryAddressId || existingOrder.deliveryAddressId,
      );
    }

    // Update transport type if provided
    if (transportType) {
      existingOrder.assignTransport(transportType);
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
