import {
  AddressValidationError,
  validateAddressExists,
} from '../../utils/addressValidator';
import { Order } from '../entities/Order';
import { TransportType } from '../enums/TransportType';
import { OrderRepository } from '../repositories/OrderRepository';

interface CreateOrderDTO {
  userId: string;
  pickupAddressId: string;
  deliveryAddressId: string;
  transportType?: TransportType;
  authToken: string;
}

export class CreateOrderUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute({
    userId,
    pickupAddressId,
    deliveryAddressId,
    transportType,
    authToken,
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

    // Validate pickup address
    const pickupAddressExists = await validateAddressExists(
      pickupAddressId,
      authToken,
    );
    if (!pickupAddressExists) {
      throw new AddressValidationError('Pickup address does not exist');
    }

    // Validate delivery address
    const deliveryAddressExists = await validateAddressExists(
      deliveryAddressId,
      authToken,
    );
    if (!deliveryAddressExists) {
      throw new AddressValidationError('Delivery address does not exist');
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
