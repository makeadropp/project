import { Order } from '../entities/Order';

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findByUserId(userId: string): Promise<Order[]>;
  update(order: Order): Promise<Order>;
  delete(id: string): Promise<void>;
  exists(id: string): Promise<boolean>;
}
