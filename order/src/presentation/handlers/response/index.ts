import { Context } from 'hono';
import { StatusCode } from 'hono/utils/http-status';
import * as HttpStatusCodes from 'stoker/http-status-codes';

export const handleResponse = (
  c: Context,
  data: unknown,
  status: StatusCode = HttpStatusCodes.OK,
) => {
  return c.json(
    {
      status: 'success',
      data,
    },
    status,
  );
};
