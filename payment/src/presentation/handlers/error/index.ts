import { Context } from 'hono';
import { ZodError } from 'zod';

export const handleError = (c: Context, error: unknown) => {
  if (error instanceof ZodError) {
    return c.json(
      {
        status: 'error',
        message: 'Validation error',
        errors: error.errors,
      },
      400,
    );
  }

  return c.json(
    {
      status: 'error',
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
    },
    500,
  );
};
