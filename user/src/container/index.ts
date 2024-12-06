import { CreateUserUseCase } from "../domain/usecases/CreateUserUseCase";
import { LoginUseCase } from "../domain/usecases/LoginUseCase";
import { PostgresUserRepository } from "../infrastructure/repositories/PostgresUserRepository";
import { AuthController } from "../presentation/controllers/AuthController";
import { UserController } from "../presentation/controllers/UserController";

export class Container {
  private static userRepository: PostgresUserRepository;
  private static createUserUseCase: CreateUserUseCase;
  private static loginUseCase: LoginUseCase;
  private static userController: UserController;
  private static authController: AuthController;

  static getUserController(): UserController {
    if (!this.userController) {
      this.userController = new UserController(this.getCreateUserUseCase());
    }
    return this.userController;
  }

  private static getCreateUserUseCase(): CreateUserUseCase {
    if (!this.createUserUseCase) {
      this.createUserUseCase = new CreateUserUseCase(this.getUserRepository());
    }
    return this.createUserUseCase;
  }

  private static getUserRepository(): PostgresUserRepository {
    if (!this.userRepository) {
      this.userRepository = new PostgresUserRepository();
    }
    return this.userRepository;
  }

  static getAuthController(): AuthController {
    if (!this.authController) {
      this.authController = new AuthController(this.getLoginUseCase());
    }
    return this.authController;
  }

  private static getLoginUseCase(): LoginUseCase {
    if (!this.loginUseCase) {
      this.loginUseCase = new LoginUseCase(this.getUserRepository());
    }
    return this.loginUseCase;
  }
}