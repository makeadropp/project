import { z } from 'zod';
import {
  CreateAddressInput,
  createAddressSchema,
} from '../schemas/address.schema';

export class AddressValidator {
  validateCreate(input: unknown): CreateAddressInput {
    return createAddressSchema.parse(input);
  }

  validateId(id: unknown): string {
    const schema = z.string().uuid('Invalid ID format');
    return schema.parse(id);
  }
}
