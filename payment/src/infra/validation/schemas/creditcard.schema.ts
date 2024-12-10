import { z } from 'zod';

export const creditCardPaymentSchema = z.object({
  userId: z.string().uuid('Invalid user ID format'),
  payment: z.object({
    identifier: z.string(),
    amount: z.object({
      value: z.number().positive().max(3999, 'Maximum amount is 3999€'),
      currency: z.string().default('EUR'),
    }),
    successUrl: z.string().url('Must be a valid URL'),
    failUrl: z.string().url('Must be a valid URL'),
    backUrl: z.string().url('Must be a valid URL'),
    lang: z.string().default('PT'),
    customer: z.object({
      notify: z.boolean().default(true),
      email: z.string().email('Must be a valid email'),
    }),
  }),
});

export type CreditCardPaymentSchemaType = z.infer<
  typeof creditCardPaymentSchema
>;
