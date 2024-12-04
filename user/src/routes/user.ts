import { Hono } from "hono";
import { CreateUserUseCase } from "../domain/usecases/CreateUserUseCase";
import { PostgresUserRepository } from "../infrastructure/repositories/PostgresUserRepository";
import { UserController } from "../presentation/controllers/UserController";

export const userRouter = new Hono();

const userRepository = new PostgresUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const userController = new UserController(createUserUseCase);

userRouter.post('/', (c) => userController.create(c));