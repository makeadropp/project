import { Address } from "../entities/Address";
import { AddressRepository } from "../repositories/AddressRepository";


export class GetAddressListUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute(id: string): Promise<Address[]> {
    return this.addressRepository.list(id);
  }
}