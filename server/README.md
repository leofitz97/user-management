# User Management API with JWT Authentication

A comprehensive NestJS application implementing session-based authentication using JWT with PostgreSQL database.

## Features

- User registration and login
- JWT access and refresh tokens
- Password hashing with bcrypt
- Input validation with class-validator
- Swagger API documentation
- PostgreSQL database integration
- Comprehensive error handling

## Tech Stack

- **Backend**: NestJS
- **Database**: PostgreSQL
- **Authentication**: JWT (Access & Refresh Tokens)
- **Password Hashing**: bcrypt
- **Validation**: class-validator
- **Documentation**: Swagger/OpenAPI
- **ORM**: Sequelize

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd user-management
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add the following:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=user_management
DB_SSL=false

# JWT Configuration
JWT_ACCESS_SECRET=your-super-secret-jwt-access-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-jwt-refresh-key-change-this-in-production
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Application Configuration
PORT=3000
NODE_ENV=development
```

4. Start PostgreSQL database (if not already running):
```bash
# Using Docker
docker run --name user-management-db -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=user_management -p 5432:5432 -d postgres:latest

# Or using local PostgreSQL installation
# Make sure PostgreSQL is running and accessible
```

5. Start the application:
```bash
npm run start:dev
```

## API Endpoints

### Authentication

#### Register User
- **POST** `/auth/register`
- **Body**: 
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login User
- **POST** `/auth/login`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Response**:
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Refresh Token
- **POST** `/auth/refresh`
- **Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```
- **Response**:
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt with salt rounds of 12
2. **JWT Tokens**: 
   - Access tokens expire in 15 minutes
   - Refresh tokens expire in 7 days
   - Both tokens use different secrets for enhanced security
3. **Input Validation**: All inputs are validated using class-validator decorators
4. **CORS**: Configured to allow specific origins
5. **Environment Variables**: Sensitive data stored in environment variables

## Swagger Documentation

Access the API documentation at:
```
http://localhost:3000/api
```

The Swagger UI provides:
- Interactive API documentation
- Request/response examples
- Authentication testing with Bearer tokens

## Database Schema

The application uses a single `users` table with the following structure:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Testing

### Unit Tests
Run the test suite:
```bash
npm run test
```

Run tests with coverage:
```bash
npm run test:cov
```

### Integration Tests
Test the complete authentication flow:
```bash
npm run test:auth
```

**Note**: Make sure the application is running (`npm run start:dev`) before running the integration test.

### Database Migrations
Run database migrations:
```bash
npm run db:migrate
```

**Prerequisites**: PostgreSQL must be running and accessible with the credentials specified in your `.env` file.

## Development

- **Development server**: `npm run start:dev`
- **Production build**: `npm run build`
- **Linting**: `npm run lint`
- **Formatting**: `npm run format`

## Production Considerations

1. **Environment Variables**: Use strong, unique secrets for JWT tokens
2. **Database**: Use a production PostgreSQL instance with SSL
3. **CORS**: Configure CORS to allow only trusted origins
4. **SSL**: Enable SSL for database connections in production
5. **Logging**: Implement proper logging for security events
6. **Rate Limiting**: Consider adding rate limiting for authentication endpoints

## License

This project is licensed under the MIT License.