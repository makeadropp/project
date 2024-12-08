import { Hono } from "hono";
import { env } from "../config/env";
import { UserRole } from "../domain/entities/User";
import { CreateUserUseCase } from "../domain/usecases/CreateUserUseCase";
import { LoginUseCase } from "../domain/usecases/LoginUseCase";
import { ResetPasswordUseCase } from "../domain/usecases/ResetPasswordUseCase";
import { PostgresUserRepository } from "../infra/repositories/PostgresUserRepository";
import { authMiddleware, roleGuard, selfOrAdmin } from "../middleware/auth";
import { UserController } from "../presentation/controllers/UserController";

export const userRouter = new Hono();
const userRepository = new PostgresUserRepository();
const createUserUseCase = new CreateUserUseCase(userRepository);
const loginUseCase = new LoginUseCase(userRepository, env.JWT_SECRET);
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository);
const userController = new UserController(
  createUserUseCase, 
  loginUseCase, 
  resetPasswordUseCase,
  userRepository
);

// Public routes
userRouter.post("/register", (c) => userController.register(c));
userRouter.post("/login", (c) => userController.login(c));

// Authenticated routes
userRouter.get("/me", 
  authMiddleware, 
  (c) => userController.me(c)
);

// Protected routes with self or admin access
userRouter.get("/profile/:userId", 
  authMiddleware,
  selfOrAdmin(),
  (c) => userController.getProfile(c)
);

userRouter.post("/reset-password", 
  authMiddleware,
  (c) => userController.resetPassword(c)
);

// Admin only routes
userRouter.get("/users",
  authMiddleware,
  roleGuard(UserRole.ADMIN),
  (c) => userController.getAllUsers(c)
);

// Driver specific routes
userRouter.get("/drivers",
  authMiddleware,
  roleGuard(UserRole.ADMIN, UserRole.DRIVER),
  (c) => userController.getDrivers(c)
);

// Customer specific routes
userRouter.get("/customers",
  authMiddleware,
  roleGuard(UserRole.ADMIN),
  (c) => userController.getCustomers(c)
);
