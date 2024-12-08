import { CreateAddressUseCase } from "../domain/usecases/CreateAddressUseCase";
import { GetAddressListUseCase } from "../domain/usecases/GetAddressListUseCase";
import { PostgresAdressRepository } from "../infrastructure/repositories/PostgresAdressRepository";
import { AddressController } from "../presentation/controllers/AddressController";

export class Container {
  private static adressRepository: PostgresAdressRepository;
  private static CreateAddressUseCase: CreateAddressUseCase;
  private static GetAddressListUseCase: GetAddressListUseCase
  private static addressController: AddressController;

  static getAddressController(): AddressController {
    if (!this.addressController) {
      this.addressController = new AddressController(this.getCreateAddressUseCase(), this.getAddressListUseCase());
    }
    return this.addressController;
  }

  private static getCreateAddressUseCase(): CreateAddressUseCase {
    if (!this.CreateAddressUseCase) {
      this.CreateAddressUseCase = new CreateAddressUseCase(this.getAddressRepository());
    }
    return this.CreateAddressUseCase;
  }

  private static getAddressListUseCase(): GetAddressListUseCase {
    if (!this.GetAddressListUseCase) {
      this.GetAddressListUseCase = new GetAddressListUseCase(this.getAddressRepository());
    }
    return this.GetAddressListUseCase;
  }

  private static getAddressRepository(): PostgresAdressRepository {
    if (!this.adressRepository) {
      this.adressRepository = new PostgresAdressRepository();
    }
    return this.adressRepository;
  }


}