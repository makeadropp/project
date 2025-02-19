import { Context } from 'hono';
import { CreateAddressUseCase } from '../../domain/usecases/CreateAddressUseCase';
import { DeleteAddressUseCase } from '../../domain/usecases/DeleteAddressUseCase';
import { GetAddressByIdUseCase } from '../../domain/usecases/GetAddressByIdUseCase';
import { ListAddressesUseCase } from '../../domain/usecases/ListAddressesUseCase';
import { UpdateAddressUseCase } from '../../domain/usecases/UpdateAddressUseCase';
import { AddressValidator } from '../../infra/validation/validators/AddressValidator';
import { handleError } from '../handlers/error';
import { handleResponse } from '../handlers/response';

export class AddressController {
  constructor(
    private readonly listAddressesUseCase: ListAddressesUseCase,
    private readonly getAddressByIdUseCase: GetAddressByIdUseCase,
    private readonly createAddressUseCase: CreateAddressUseCase,
    private readonly updateAddressUseCase: UpdateAddressUseCase,
    private readonly deleteAddressUseCase: DeleteAddressUseCase,
    private readonly addressValidator: AddressValidator,
  ) {}

  list = async (c: Context) => {
    try {
      const addresses = await this.listAddressesUseCase.execute();
      return handleResponse(c, addresses);
    } catch (error) {
      return handleError(c, error);
    }
  };

  getByID = async (c: Context) => {
    try {
      const id = c.req.param('id');
      const validatedId = this.addressValidator.validateId(id);
      const address = await this.getAddressByIdUseCase.execute(validatedId);
      return handleResponse(c, address);
    } catch (error) {
      return handleError(c, error);
    }
  };

  create = async (c: Context) => {
    try {
      const input = await c.req.json();
      const validatedData = this.addressValidator.validateCreate(input);
      const { userId } = c.get('user');
      const data = {
        ...validatedData,
        address_id: crypto.randomUUID(),
        user_id: userId,
      };

      const address = await this.createAddressUseCase.execute(data);
      return handleResponse(c, address, 201);
    } catch (error) {
      return handleError(c, error);
    }
  };

  update = async (c: Context) => {
    try {
      const id = c.req.param('id');
      const input = await c.req.json();

      const validatedId = this.addressValidator.validateId(id);
      const validatedData = this.addressValidator.validateUpdate(input);

      const address = await this.updateAddressUseCase.execute(
        validatedId,
        validatedData,
      );
      return handleResponse(c, address);
    } catch (error) {
      return handleError(c, error);
    }
  };

  delete = async (c: Context) => {
    try {
      const id = c.req.param('id');
      const validatedId = this.addressValidator.validateId(id);

      await this.deleteAddressUseCase.execute(validatedId);
      return handleResponse(c, null, 204);
    } catch (error) {
      return handleError(c, error);
    }
  };
}
