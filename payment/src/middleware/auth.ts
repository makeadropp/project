import { Context, Next } from 'hono';
import { verify } from 'jsonwebtoken';
import { env } from '../config/env';
import { JWTUser } from '../types/auth';

export const auth = async (c: Context, next: Next) => {
  try {
    const authorization = c.req.header('Authorization');

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return c.json({ status: 'error', message: 'No token provided' }, 401);
    }

    const token = authorization.split(' ')[1];
    const decoded = verify(token, env.JWT_SECRET) as JWTUser;

    c.set('user', decoded);
    await next();
  } catch (error) {
    return c.json({ status: 'error', message: 'Invalid token' }, 401);
  }
};
