import { Hono } from "hono";
import { env } from "../config/env";
import { CreateUserUseCase } from "../domain/usecases/CreateUserUseCase";
import { LoginUseCase } from "../domain/usecases/LoginUseCase";
import { PostgresUserRepository } from "../infra/repositories/PostgresUserRepository";
import { authMiddleware } from "../middleware/auth";
import { UserController } from "../presentation/controllers/UserController";

export const userRouter = new Hono();
const userRepository = new PostgresUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const loginUseCase = new LoginUseCase(userRepository, env.JWT_SECRET);
const userController = new UserController(createUserUseCase, loginUseCase);

userRouter.post("/register", (c) => userController.register(c));
userRouter.post("/login", (c) => userController.login(c));
userRouter.get("/profile", authMiddleware, (c) => userController.getProfile(c));


