import { env } from '@/config/env';

interface AddressServiceConfig {
  baseUrl: string;
}

const config: AddressServiceConfig = {
  baseUrl: env.ADDRESS_SERVICE_URL || 'http://localhost:3001',
};

export class AddressValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AddressValidationError';
  }
}

export async function validateAddressExists(
  addressId: string,
  authToken: string,
): Promise<boolean> {
  console.log('Address service URL:', `${config.baseUrl}/${addressId}`);
  try {
    const response = await fetch(`${config.baseUrl}/${addressId}`, {
      headers: {
        Authorization: authToken,
      },
    });
    console.log('Response:', response);

    if (response.status === 404 || response.status === 500) {
      return false;
    }

    if (!response.ok) {
      throw new Error(`Failed to validate address: ${response.statusText}`);
    }

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Address validation failed: ${error.message}`);
    }
    throw new Error('Address validation failed: Unknown error');
  }
}
