import { Address } from "../entities/Address";

export interface AddressRepository {
  findById(id: string): Promise<Address | null>;
  list(id: string): Promise<Address[]>;
  create(address: Omit<Address, 'id' | 'createdAt' | 'updatedAt'>): Promise<Address>;
  update(id: string, address: Partial<Address>): Promise<Address>;
  delete(id: string): Promise<void>;
}