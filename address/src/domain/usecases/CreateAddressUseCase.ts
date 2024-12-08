import { Address } from '../entities/Address';
import { AddressRepository } from '../repositories/AddressRepository';

export class CreateAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute(address: Address): Promise<Address> {
    return this.addressRepository.create(address);
  }
}
