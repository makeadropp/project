import { PaymentStatus } from '../enums/PaymentStatus';

export class Payment {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly orderId: string,
    public readonly amount: number,
    public readonly currency: string,
    public paymentMethod: string,
    public status: PaymentStatus,
    public transactionId: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date,
    public completedAt: Date | null,
    public refundedAt: Date | null,
    public failedAt: Date | null,
    public cancelledAt: Date | null,
  ) {}

  public static create(
    userId: string,
    orderId: string,
    amount: number,
    currency: string,
    paymentMethod: string,
  ): Payment {
    const now = new Date();
    return new Payment(
      crypto.randomUUID(),
      userId,
      orderId,
      amount,
      currency,
      paymentMethod,
      PaymentStatus.PENDING,
      null,
      now,
      now,
      null,
      null,
      null,
      null,
    );
  }

  public updateStatus(newStatus: PaymentStatus): void {
    if (this.status === PaymentStatus.COMPLETED) {
      throw new Error('Cannot update status of completed payment');
    }
    if (this.status === PaymentStatus.REFUNDED) {
      throw new Error('Cannot update status of refunded payment');
    }
    if (this.status === PaymentStatus.CANCELLED) {
      throw new Error('Cannot update status of cancelled payment');
    }

    this.status = newStatus;
    this.updatedAt = new Date();

    switch (newStatus) {
      case PaymentStatus.COMPLETED:
        this.completedAt = new Date();
        break;
      case PaymentStatus.REFUNDED:
        this.refundedAt = new Date();
        break;
      case PaymentStatus.FAILED:
        this.failedAt = new Date();
        break;
      case PaymentStatus.CANCELLED:
        this.cancelledAt = new Date();
        break;
    }
  }

  public setTransactionId(transactionId: string): void {
    if (this.transactionId) {
      throw new Error('Transaction ID is already set');
    }
    this.transactionId = transactionId;
    this.updatedAt = new Date();
  }

  public cancel(): void {
    if (this.status === PaymentStatus.COMPLETED) {
      throw new Error('Cannot cancel completed payment');
    }
    if (this.status === PaymentStatus.REFUNDED) {
      throw new Error('Cannot cancel refunded payment');
    }
    if (this.status === PaymentStatus.CANCELLED) {
      throw new Error('Payment is already cancelled');
    }

    this.status = PaymentStatus.CANCELLED;
    this.cancelledAt = new Date();
    this.updatedAt = new Date();
  }

  public refund(): void {
    if (this.status !== PaymentStatus.COMPLETED) {
      throw new Error('Can only refund completed payments');
    }

    this.status = PaymentStatus.REFUNDED;
    this.refundedAt = new Date();
    this.updatedAt = new Date();
  }
}
