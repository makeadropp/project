import { Address } from '../../domain/entities/Address';
import { AddressRepository } from '../../domain/repositories/AddressRepository';

export class GetAddressByIdUseCase {
  constructor(private addressRepository: AddressRepository) {}

  async execute(id: string): Promise<Address> {
    const address = await this.addressRepository.findById(id);

    if (!address) {
      throw new Error('Address not found');
    }

    return address;
  }
}
