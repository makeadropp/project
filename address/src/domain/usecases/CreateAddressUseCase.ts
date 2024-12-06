import { Address } from "../entities/Address";
import { AddressRepository } from "../repositories/AddressRepository";

export class CreateAddressUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute(data: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address> {
    return this.addressRepository.create(data);
  }
}