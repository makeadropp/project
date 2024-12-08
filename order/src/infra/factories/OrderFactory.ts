import { db } from '../../config/database';
import { CancelOrderUseCase } from '../../domain/usecases/CancelOrderUseCase';
import { CreateOrderUseCase } from '../../domain/usecases/CreateOrderUseCase';
import { GetOrderByIdUseCase } from '../../domain/usecases/GetOrderByIdUseCase';
import { ListUserOrdersUseCase } from '../../domain/usecases/ListUserOrdersUseCase';
import { UpdateOrderUseCase } from '../../domain/usecases/UpdateOrderUseCase';
import { OrderController } from '../../presentation/controllers/OrderController';
import { PostgresOrderRepository } from '../repositories/PostgresOrderRepository';

export class OrderFactory {
  static createController(): OrderController {
    const repository = new PostgresOrderRepository(db);

    return new OrderController(
      new CreateOrderUseCase(repository),
      new GetOrderByIdUseCase(repository),
      new UpdateOrderUseCase(repository),
      new ListUserOrdersUseCase(repository),
      new CancelOrderUseCase(repository),
    );
  }
}
