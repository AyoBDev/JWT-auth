# JWT Authentication Task Management API

A Node.js and Express REST API with PostgreSQL database using Prisma ORM for managing tasks with JWT authentication.

## Features

- JWT-based authentication and authorization
- User registration and login
- RESTful CRUD operations for tasks
- User-specific task management
- Password validation and hashing
- JSON request and response handling
- Request validation middleware
- UUID-based unique identifiers
- PostgreSQL database with Prisma ORM
- Prisma 7 with pg driver adapter
- Environment-based configuration using dotenv
- Request logging middleware
- Pagination support

## Prerequisites

- Node.js v18 or higher
- npm
- PostgreSQL database

## Setup

1. Clone or download the project

2. Install dependencies:
```bash
npm install
```

3. Create a .env file in the root directory:
```bash
DATABASE_URL="postgresql://taskuser:strongpassword@localhost:5432/taskdb"
PORT=3000
NODE_ENV=development
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
```

4. Run Prisma migrations:
```bash
npx prisma migrate dev
```

5. Generate Prisma Client:
```bash
npx prisma generate
```

6. (Optional) Seed the database:
```bash
npm run seed
```

## Running the Server

Start the server:
```bash
node server.js
```

Server will start at: http://localhost:3000

## API Endpoints

### Authentication

- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login user
- `GET /api/auth/me` – Get current user profile (requires authentication)

### Tasks (All require authentication)

- `GET /api/tasks` – Returns user's tasks (supports pagination and filtering)
  - Query params: `page`, `limit`, `status`, `priority`
- `GET /api/tasks/:id` – Returns a single task by ID
- `POST /api/tasks` – Creates a new task
- `PUT /api/tasks/:id` – Updates an existing task
- `DELETE /api/tasks/:id` – Deletes a task

### Request Body Examples

**User Registration:**
```json
{
  "email": "user@example.com",
  "password": "Password123!",
  "name": "John Doe"
}
```

**User Login:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Task Creation:**
```json
{
  "title": "Build API",
  "description": "Create a task management API",
  "status": "PENDING",
  "priority": "MEDIUM"
}
```

## Validation Rules

### User Registration
- `email` must be a valid email format
- `password` must be at least 8 characters with uppercase, lowercase, number, and special character
- `name` is optional

### Tasks
- `title` is required and must be at least 3 characters
- `status` must be one of: `PENDING`, `IN_PROGRESS`, `COMPLETED`
- `priority` must be one of: `LOW`, `MEDIUM`, `HIGH`

## Testing

Test the API using Postman, Insomnia, or curl:

**Register a user:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!","name":"Test User"}'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'
```

**Create a task (requires JWT token):**
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"title":"Test Task","description":"Testing API"}'
```

## Authentication

- JWT tokens are required for all task operations
- Include the token in the Authorization header: `Bearer YOUR_JWT_TOKEN`
- Tokens expire in 7 days by default
- Users can only access their own tasks

## User Roles

- `USER` - Default role, can manage own tasks
- `ADMIN` - Administrative role (future use)

## Notes

- Data is persisted in PostgreSQL database
- Passwords are hashed using bcrypt
- All user inputs are validated
- JWT tokens are used for stateless authentication