import { z } from 'zod';

export const AddressType = z.enum(['HOME', 'WORK', 'OTHER']);

export const createAddressSchema = z.object({
  street: z.string().min(1, 'Street is required'),
  number: z.string().optional(),
  complement: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().length(2, 'State must be 2 characters'),
  postal_code: z.string().length(8, 'Postal code must be 8 characters'),
  country: z.string().min(1, 'Country is required'),
  address_type: AddressType,
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  is_default: z.boolean().optional().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;

export const idParamSchema = z.string().uuid();

export const addressSchema = createAddressSchema.extend({
  address_id: z.string().uuid().optional(),
  user_id: z.string().uuid(),
  created_at: z.string().datetime().optional(),
  updated_at: z.string().datetime().optional(),
});

export type Address = z.infer<typeof addressSchema>;
