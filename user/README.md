# User Service

A microservice for user management built with Hono.js, TypeScript, and PostgreSQL, following clean architecture principles.

## Features

- User registration and authentication
- JWT-based authentication
- Password hashing with bcrypt
- PostgreSQL database integration
- Clean Architecture implementation
- TypeScript support

## Prerequisites

- Node.js/Bun runtime
- PostgreSQL database
- Docker (optional, for containerization)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
bun install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3001
JWT_SECRET=your-secret-key
DATABASE_URL=postgres://postgres:postgres@localhost:5432/users
NODE_ENV=development
```

## Database Setup

1. Ensure PostgreSQL is running
2. Create the database:
```sql
CREATE DATABASE users;
```
3. The migrations will run automatically on service startup

## Running the Service

Development mode:
```bash
bun run dev
```

Production mode:
```bash
bun run start
```

## API Endpoints

### Authentication

#### Register a new user
```http
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

## Project Structure

```
src/
├── config/         # Configuration files
├── domain/         # Business logic and interfaces
│   ├── entities/
│   ├── repositories/
│   └── usecases/
├── infra/         # Infrastructure layer
│   ├── db/
│   └── repositories/
├── middleware/    # HTTP middleware
├── presentation/ # Controllers and routes
│   └── controllers/
├── routes/       # Route definitions
└── utils/        # Utility functions
```

## Architecture

This service follows Clean Architecture principles:

1. Domain Layer: Contains business logic and interfaces
2. Infrastructure Layer: Implements repositories and external services
3. Presentation Layer: Handles HTTP requests and responses
4. Use Cases: Implements business logic operations

## Error Handling

The service includes comprehensive error handling:

- Input validation errors
- Authentication errors
- Database errors
- Business logic errors

## Security

- Password hashing using bcrypt
- JWT-based authentication
- Input validation
- CORS protection
- Environment variable configuration

## Testing

Run tests:
```bash
bun test
```

Watch mode:
```bash
bun test:watch
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
