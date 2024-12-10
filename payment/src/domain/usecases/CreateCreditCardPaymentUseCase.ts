import { env } from '@/config/env';
import { Payment } from '../entities/Payment';
import { PaymentRepository } from '../repositories/PaymentRepository';

interface CreditCardPaymentRequest {
  userId: string;
  orderId: string;
  amount: number;
  currency: string;
  email: string;
  successUrl: string;
  failUrl: string;
  backUrl: string;
}

interface EupagoResponse {
  success: boolean;
  message?: string;
  paymentUrl?: string;
}

interface EupagoApiResponse {
  success: boolean;
  message?: string;
  paymentUrl?: string;
  reference?: string;
}

export class CreateCreditCardPaymentUseCase {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async execute(request: CreditCardPaymentRequest): Promise<EupagoResponse> {
    try {
      // Create payment record
      const payment = Payment.create(
        request.userId,
        request.orderId,
        request.amount,
        request.currency,
        'credit_card',
      );

      // Save initial payment record
      await this.paymentRepository.create(payment);

      // Prepare Eupago API request
      const eupagoPayload = {
        payment: {
          identifier: payment.id,
          amount: {
            value: request.amount,
            currency: request.currency,
          },
          successUrl: request.successUrl,
          failUrl: request.failUrl,
          backUrl: request.backUrl,
          lang: 'PT',
          customer: {
            notify: true,
            email: request.email,
          },
        },
      };
      console.log('Eupago payload', env.EUPAGO_API_KEY);

      // Make request to Eupago API
      const response = await fetch(
        'https://sandbox.eupago.pt/api/v1.02/creditcard/create',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `ApiKey ${env.EUPAGO_API_KEY}`,
          },
          body: JSON.stringify(eupagoPayload),
        },
      );

      console.log('Eupago response', response);

      const data = (await response.json()) as EupagoApiResponse;

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create credit card payment');
      }

      // Update payment with transaction details if needed
      if (data.reference) {
        payment.setTransactionId(data.reference);
        await this.paymentRepository.update(payment);
      }

      return {
        success: true,
        paymentUrl: data.paymentUrl,
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          message: error.message,
        };
      }
      return {
        success: false,
        message: 'An unexpected error occurred',
      };
    }
  }
}
