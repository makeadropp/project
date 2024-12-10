# Order Service

A microservice for managing orders in a delivery system.

## Features

- Create new orders with pickup and delivery addresses
- Update order details (before pickup)
- Cancel orders (if not delivered)
- Track order status
- View order history by user
- Secure endpoints with JWT authentication

## API Endpoints

### Orders

- `POST /orders` - Create a new order
- `GET /orders/:id` - Get order details
- `PUT /orders/:id` - Update order information
- `DELETE /orders/:id` - Cancel an order
- `GET /orders/user/:userId` - List orders by user

### Health Check

- `GET /health` - Service health check

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and update the values
3. Install dependencies:
   ```bash
   bun install
   ```
4. Start the PostgreSQL database
5. Run database migrations:
   ```bash
   bun run db:migrate
   ```
6. Start the service:
   ```bash
   bun run dev
   ```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production/test)
- `DATABASE_URL` - PostgreSQL connection URL
- `RABBITMQ_URL` - RabbitMQ connection URL
- `JWT_SECRET` - Secret key for JWT authentication

## Order States

- `PROCESSING` - Initial state when order is created
- `IN_TRANSIT` - Order has been picked up and is being delivered
- `DELIVERED` - Order has been successfully delivered
- `CANCELLED` - Order has been cancelled

## Transport Types

- `GROUND` - Ground transportation
- `AIR` - Air transportation
- `SEA` - Sea transportation

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Request Examples

### Create Order

```http
POST /orders
Content-Type: application/json
Authorization: Bearer <token>

{
  "userId": "user-uuid",
  "pickupAddressId": "address-uuid",
  "deliveryAddressId": "address-uuid",
  "transportType": "GROUND"
}
```

### Update Order

```http
PUT /orders/:id
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "IN_TRANSIT",
  "estimatedDeliveryDate": "2024-03-20T15:00:00Z"
}
```

## Error Handling

The service returns appropriate HTTP status codes and error messages:

- `400` - Bad Request (invalid input)
- `401` - Unauthorized (invalid/missing token)
- `404` - Not Found (order doesn't exist)
- `500` - Internal Server Error

## Development

Run tests:

```bash
bun test
```

Format code:

```bash
bun run format
```
