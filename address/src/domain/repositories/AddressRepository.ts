import { Address } from '../entities/Address';

export interface AddressRepository {
  findAll(): Promise<Address[]>;
  findById(id: string): Promise<Address | null>;
  create(address: Address): Promise<Address>;
}
