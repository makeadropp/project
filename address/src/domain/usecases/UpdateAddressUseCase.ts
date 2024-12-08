import { Address } from '../entities/Address';
import { AddressRepository } from '../repositories/AddressRepository';

export class UpdateAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(addressId: string, data: Partial<Address>): Promise<Address> {
    return this.addressRepository.update(addressId, data);
  }
}
