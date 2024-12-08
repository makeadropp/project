import { AddressRepository } from '../repositories/AddressRepository';

export class DeleteAddressUseCase {
  constructor(private readonly addressRepository: AddressRepository) {}

  async execute(addressId: string): Promise<void> {
    return this.addressRepository.delete(addressId);
  }
}
