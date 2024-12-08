import { z } from 'zod';
import {
  CreateAddressInput,
  UpdateAddressInput,
  createAddressSchema,
  updateAddressSchema,
} from '../schemas/address.schema';

export class AddressValidator {
  validateCreate(input: unknown): CreateAddressInput {
    return createAddressSchema.parse(input);
  }

  validateUpdate(input: unknown): UpdateAddressInput {
    return updateAddressSchema.parse(input);
  }

  validateId(id: unknown): string {
    const schema = z.string().uuid('Invalid ID format');
    return schema.parse(id);
  }
}
