import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { initializeDatabase } from './config/database';
import { RabbitMQService } from './infra/messaging/rabbitmq';
import healthRoutes from './routes/health';
import paymentRoutes from './routes/payment';

// Initialize services
initializeDatabase();
const rabbitMQService = RabbitMQService.getInstance();
rabbitMQService.connect().catch(error => {
  console.error('Failed to connect to RabbitMQ:', error);
  // Continue running the app even if RabbitMQ connection fails
});

export const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', prettyJSON());
app.use('*', secureHeaders());
app.use('*', logger());

// Routes
app.route('/health', healthRoutes);
app.route('/', paymentRoutes);
