import { Order } from '../../domain/entities/Order';
import { OrderStatus } from '../../domain/enums/OrderStatus';
import { TransportType } from '../../domain/enums/TransportType';
import { OrderRepository } from '../../domain/repositories/OrderRepository';

type DatabasePool = {
  query: (text: string, params?: any[]) => Promise<any>;
};

interface OrderRow {
  id: string;
  user_id: string;
  pickup_address_id: string;
  delivery_address_id: string;
  transport_type: TransportType | null;
  status: OrderStatus;
  estimated_delivery_date: Date | null;
  created_at: Date;
  updated_at: Date;
  cancelled_at: Date | null;
  delivered_at: Date | null;
}

export class PostgresOrderRepository implements OrderRepository {
  constructor(private readonly db: DatabasePool) {}

  async create(order: Order): Promise<Order> {
    const result = await this.db.query(
      `
      INSERT INTO orders (
        id, user_id, pickup_address_id, delivery_address_id,
        transport_type, status, estimated_delivery_date,
        created_at, updated_at, cancelled_at, delivered_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
      `,
      [
        order.id,
        order.userId,
        order.pickupAddressId,
        order.deliveryAddressId,
        order.transportType,
        order.status,
        order.estimatedDeliveryDate,
        order.createdAt,
        order.updatedAt,
        order.cancelledAt,
        order.deliveredAt,
      ],
    );

    return this.mapToOrder(result.rows[0]);
  }

  async findById(id: string): Promise<Order | null> {
    const result = await this.db.query('SELECT * FROM orders WHERE id = $1', [
      id,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapToOrder(result.rows[0]);
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const result = await this.db.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId],
    );

    return result.rows.map((row: OrderRow) => this.mapToOrder(row));
  }

  async update(order: Order): Promise<Order> {
    const result = await this.db.query(
      `
      UPDATE orders
      SET
        pickup_address_id = $1,
        delivery_address_id = $2,
        transport_type = $3,
        status = $4,
        estimated_delivery_date = $5,
        updated_at = $6,
        cancelled_at = $7,
        delivered_at = $8
      WHERE id = $9
      RETURNING *
      `,
      [
        order.pickupAddressId,
        order.deliveryAddressId,
        order.transportType,
        order.status,
        order.estimatedDeliveryDate,
        order.updatedAt,
        order.cancelledAt,
        order.deliveredAt,
        order.id,
      ],
    );

    return this.mapToOrder(result.rows[0]);
  }

  async delete(id: string): Promise<void> {
    await this.db.query('DELETE FROM orders WHERE id = $1', [id]);
  }

  async exists(id: string): Promise<boolean> {
    const result = await this.db.query(
      'SELECT EXISTS(SELECT 1 FROM orders WHERE id = $1)',
      [id],
    );
    return result.rows[0].exists;
  }

  private mapToOrder(row: OrderRow): Order {
    return new Order(
      row.id,
      row.user_id,
      row.pickup_address_id,
      row.delivery_address_id,
      row.transport_type,
      row.status,
      row.estimated_delivery_date,
      row.created_at,
      row.updated_at,
      row.cancelled_at,
      row.delivered_at,
    );
  }
}
