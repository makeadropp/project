import { CancelOrderUseCase } from '../../domain/usecases/CancelOrderUseCase';
import { CreateOrderUseCase } from '../../domain/usecases/CreateOrderUseCase';
import { GetOrderByIdUseCase } from '../../domain/usecases/GetOrderByIdUseCase';
import { ListUserOrdersUseCase } from '../../domain/usecases/ListUserOrdersUseCase';
import { UpdateOrderUseCase } from '../../domain/usecases/UpdateOrderUseCase';
import { OrderController } from '../../presentation/controllers/OrderController';
import { pool } from '../db/postgres';
import { PostgresOrderRepository } from '../repositories/PostgresOrderRepository';

export class OrderFactory {
  static createController(): OrderController {
    const repository = new PostgresOrderRepository(pool);

    return new OrderController(
      new CreateOrderUseCase(repository),
      new GetOrderByIdUseCase(repository),
      new ListUserOrdersUseCase(repository),
      new UpdateOrderUseCase(repository),
      new CancelOrderUseCase(repository),
    );
  }

  static makeUpdateOrderUseCase(): UpdateOrderUseCase {
    const repository = new PostgresOrderRepository(pool);
    return new UpdateOrderUseCase(repository);
  }
}
