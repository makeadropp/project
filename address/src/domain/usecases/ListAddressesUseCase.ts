import { Address } from '../../domain/entities/Address';
import { AddressRepository } from '../../domain/repositories/AddressRepository';

export class ListAddressesUseCase {
  constructor(public addressRepository: AddressRepository) {}

  async execute(): Promise<Address[]> {
    return this.addressRepository.findAll();
  }
}
