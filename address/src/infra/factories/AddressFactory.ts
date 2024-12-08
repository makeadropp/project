import { AddressRepository } from '../../domain/repositories/AddressRepository';
import { CreateAddressUseCase } from '../../domain/usecases/CreateAddressUseCase';
import { DeleteAddressUseCase } from '../../domain/usecases/DeleteAddressUseCase';
import { GetAddressByIdUseCase } from '../../domain/usecases/GetAddressByIdUseCase';
import { ListAddressesUseCase } from '../../domain/usecases/ListAddressesUseCase';
import { UpdateAddressUseCase } from '../../domain/usecases/UpdateAddressUseCase';
import { AddressController } from '../../presentation/controllers/AddressController';
import { PostgresAddressRepository } from '../repositories/PostgresAddressRepository';
import { AddressValidator } from '../validation/validators/AddressValidator';

export class AddressFactory {
  static makeRepository(): AddressRepository {
    return new PostgresAddressRepository();
  }

  static makeUseCases(repository: AddressRepository) {
    return {
      listAddresses: new ListAddressesUseCase(repository),
      getAddressById: new GetAddressByIdUseCase(repository),
      createAddress: new CreateAddressUseCase(repository),
      updateAddress: new UpdateAddressUseCase(repository),
      deleteAddress: new DeleteAddressUseCase(repository),
    };
  }

  static makeController(useCases: {
    listAddresses: ListAddressesUseCase;
    getAddressById: GetAddressByIdUseCase;
    createAddress: CreateAddressUseCase;
    updateAddress: UpdateAddressUseCase;
    deleteAddress: DeleteAddressUseCase;
  }) {
    const addressValidator = new AddressValidator();
    return new AddressController(
      useCases.listAddresses,
      useCases.getAddressById,
      useCases.createAddress,
      useCases.updateAddress,
      useCases.deleteAddress,
      addressValidator,
    );
  }
}
