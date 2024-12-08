import { initializeDatabase } from '@/config/database';
import { addressRouter } from '@/routes/address';
import { healthRouter } from '@/routes/health';
import { Hono } from 'hono';
import { notFound, onError } from 'stoker/middlewares';

initializeDatabase();

export const app = new Hono({
  strict: false,
});
app.notFound(notFound);
app.onError(onError);

app.route('/health', healthRouter);
app.route('/', addressRouter);
