import { Address } from '../entities/Address';

export interface AddressRepository {
  findAll(): Promise<Address[]>;
  findById(id: string): Promise<Address | null>;
  create(address: Address): Promise<Address>;
  update(id: string, data: Partial<Address>): Promise<Address>;
  delete(id: string): Promise<void>;
}
