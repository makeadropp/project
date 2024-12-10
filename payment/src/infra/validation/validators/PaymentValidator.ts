import { Context } from 'hono';
import { z } from 'zod';
import { creditCardPaymentSchema } from '../schemas/creditcard.schema';
import {
  createPaymentSchema,
  paymentIdSchema,
  updatePaymentSchema,
  userIdSchema,
} from '../schemas/payment.schema';

type ValidationResult<T> =
  | z.SafeParseSuccess<T>
  | { success: false; error: string };

export class PaymentValidator {
  static async validateCreate(
    c: Context,
  ): Promise<ValidationResult<z.infer<typeof createPaymentSchema>>> {
    try {
      const body = await c.req.json();
      const result = createPaymentSchema.safeParse(body);
      if (!result.success) {
        return { success: false, error: result.error.message };
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Invalid JSON body' };
    }
  }

  static async validateCreditCardPayment(
    c: Context,
  ): Promise<ValidationResult<z.infer<typeof creditCardPaymentSchema>>> {
    try {
      const body = await c.req.json();
      const result = creditCardPaymentSchema.safeParse(body);
      if (!result.success) {
        return { success: false, error: result.error.message };
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Invalid JSON body' };
    }
  }

  static validateId(
    c: Context,
  ): ValidationResult<z.infer<typeof paymentIdSchema>> {
    const params = c.req.param();
    const result = paymentIdSchema.safeParse({ id: params.id });
    if (!result.success) {
      return { success: false, error: result.error.message };
    }
    return result;
  }

  static validateUserId(
    c: Context,
  ): ValidationResult<z.infer<typeof userIdSchema>> {
    const params = c.req.param();
    const result = userIdSchema.safeParse({ userId: params.userId });
    if (!result.success) {
      return { success: false, error: result.error.message };
    }
    return result;
  }

  static async validateUpdate(
    c: Context,
  ): Promise<ValidationResult<z.infer<typeof updatePaymentSchema>>> {
    try {
      const params = c.req.param();
      const body = await c.req.json();
      const result = updatePaymentSchema.safeParse({
        ...body,
        id: params.id,
      });
      if (!result.success) {
        return { success: false, error: result.error.message };
      }
      return result;
    } catch (error) {
      return { success: false, error: 'Invalid JSON body' };
    }
  }
}
