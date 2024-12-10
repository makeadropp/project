import { Payment } from '../../domain/entities/Payment';
import { PaymentStatus } from '../../domain/enums/PaymentStatus';
import { PaymentRepository } from '../../domain/repositories/PaymentRepository';

type DatabasePool = {
  query: (text: string, params?: any[]) => Promise<any>;
};

interface PaymentRow {
  id: string;
  user_id: string;
  order_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: PaymentStatus;
  transaction_id: string | null;
  created_at: Date;
  updated_at: Date;
  completed_at: Date | null;
  refunded_at: Date | null;
  failed_at: Date | null;
  cancelled_at: Date | null;
}

export class PostgresPaymentRepository implements PaymentRepository {
  constructor(private readonly db: DatabasePool) {}

  async create(payment: Payment): Promise<Payment> {
    const result = await this.db.query(
      `
      INSERT INTO payments (
        id, user_id, order_id, amount, currency,
        payment_method, status, transaction_id,
        created_at, updated_at, completed_at,
        refunded_at, failed_at, cancelled_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
      `,
      [
        payment.id,
        payment.userId,
        payment.orderId,
        payment.amount,
        payment.currency,
        payment.paymentMethod,
        payment.status,
        payment.transactionId,
        payment.createdAt,
        payment.updatedAt,
        payment.completedAt,
        payment.refundedAt,
        payment.failedAt,
        payment.cancelledAt,
      ],
    );

    return this.mapToPayment(result.rows[0]);
  }

  async findById(id: string): Promise<Payment | null> {
    const result = await this.db.query('SELECT * FROM payments WHERE id = $1', [
      id,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToPayment(result.rows[0]);
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const result = await this.db.query(
      'SELECT * FROM payments WHERE order_id = $1',
      [orderId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToPayment(result.rows[0]);
  }

  async findByUserId(userId: string): Promise<Payment[]> {
    const result = await this.db.query(
      'SELECT * FROM payments WHERE user_id = $1 ORDER BY created_at DESC',
      [userId],
    );

    return result.rows.map((row: PaymentRow) => this.mapToPayment(row));
  }

  async update(payment: Payment): Promise<Payment> {
    const result = await this.db.query(
      `
      UPDATE payments
      SET
        payment_method = $1,
        status = $2,
        transaction_id = $3,
        updated_at = $4,
        completed_at = $5,
        refunded_at = $6,
        failed_at = $7,
        cancelled_at = $8
      WHERE id = $9
      RETURNING *
      `,
      [
        payment.paymentMethod,
        payment.status,
        payment.transactionId,
        payment.updatedAt,
        payment.completedAt,
        payment.refundedAt,
        payment.failedAt,
        payment.cancelledAt,
        payment.id,
      ],
    );

    return this.mapToPayment(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.query('DELETE FROM payments WHERE id = $1', [id]);
  }

  private mapToPayment(row: PaymentRow): Payment {
    return new Payment(
      row.id,
      row.user_id,
      row.order_id,
      row.amount,
      row.currency,
      row.payment_method,
      row.status,
      row.transaction_id,
      row.created_at,
      row.updated_at,
      row.completed_at,
      row.refunded_at,
      row.failed_at,
      row.cancelled_at,
    );
  }
}
