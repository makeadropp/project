import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { secureHeaders } from 'hono/secure-headers';
import { initializeDatabase } from './config/database';
import { RabbitMQConsumerFactory } from './infra/factories/RabbitMQConsumerFactory';
import healthRoutes from './routes/health';
import orderRoutes from './routes/order';

// Initialize services
initializeDatabase();
const rabbitMQConsumer = RabbitMQConsumerFactory.create();
rabbitMQConsumer.connect().catch(error => {
  console.error('Failed to connect to RabbitMQ:', error);
  process.exit(1);
});

export const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', prettyJSON());
app.use('*', secureHeaders());
app.use('*', logger());

// Routes
app.route('/health', healthRoutes);
app.route('/', orderRoutes);
