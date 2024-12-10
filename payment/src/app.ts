import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { initializeDatabase } from './config/database';
import healthRoutes from './routes/health';
import paymentRoutes from './routes/payment';

initializeDatabase();

export const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', prettyJSON());
app.use('*', secureHeaders());
app.use('*', logger());

// Routes
app.route('/health', healthRoutes);
app.route('/', paymentRoutes);
