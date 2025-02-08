import { OrderStatus } from '../enums/OrderStatus';
import { TransportType } from '../enums/TransportType';

export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public pickupAddressId: string,
    public deliveryAddressId: string,
    public transportType: TransportType | null,
    public status: OrderStatus,
    public estimatedDeliveryDate: Date | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public cancelledAt?: Date | null,
    public deliveredAt?: Date | null,
  ) {}

  public static create(
    userId: string,
    pickupAddressId: string,
    deliveryAddressId: string,
    transportType?: TransportType,
  ): Order {
    const now = new Date();
    return new Order(
      crypto.randomUUID(),
      userId,
      pickupAddressId,
      deliveryAddressId,
      transportType || null,
      OrderStatus.PENDING,
      null,
      now,
      now,
      null,
      null,
    );
  }

  public updateAddresses(
    pickupAddressId: string,
    deliveryAddressId: string,
  ): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error(
        'Cannot update addresses after order processing has started',
      );
    }
    this.pickupAddressId = pickupAddressId;
    this.deliveryAddressId = deliveryAddressId;
    this.updatedAt = new Date();
  }

  public assignTransport(transportType: TransportType): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error(
        'Cannot assign transport after order processing has started',
      );
    }
    this.transportType = transportType;
    this.updatedAt = new Date();
  }

  public updateStatus(newStatus: OrderStatus): void {
    if (this.status === OrderStatus.CANCELLED) {
      throw new Error('Cannot update status of cancelled order');
    }
    if (this.status === OrderStatus.DELIVERED) {
      throw new Error('Cannot update status of delivered order');
    }

    this.status = newStatus;
    this.updatedAt = new Date();

    if (newStatus === OrderStatus.CANCELLED) {
      this.cancelledAt = new Date();
    } else if (newStatus === OrderStatus.DELIVERED) {
      this.deliveredAt = new Date();
    }
  }

  public cancel(): void {
    if (this.status === OrderStatus.DELIVERED) {
      throw new Error('Cannot cancel delivered order');
    }
    if (this.status === OrderStatus.CANCELLED) {
      throw new Error('Order is already cancelled');
    }

    this.status = OrderStatus.CANCELLED;
    this.cancelledAt = new Date();
    this.updatedAt = new Date();
  }

  public setEstimatedDeliveryDate(date: Date): void {
    if (
      this.status === OrderStatus.CANCELLED ||
      this.status === OrderStatus.DELIVERED
    ) {
      throw new Error(
        'Cannot set estimated delivery date for cancelled or delivered orders',
      );
    }
    this.estimatedDeliveryDate = date;
    this.updatedAt = new Date();
  }
}
