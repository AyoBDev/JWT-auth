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
- Rate limiting

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jwt-auth-api
```

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

4. Set up the database:
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with test data
npm run seed
```

5. Start the server:
```bash
npm start
```

The API will be available at `http://localhost:3000`

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

**Get all tasks:**
```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Get tasks with pagination and filtering:**
```bash
curl -X GET "http://localhost:3000/api/tasks?page=1&limit=5&status=PENDING&priority=HIGH" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Authentication

- JWT tokens are required for all task operations
- Include the token in the Authorization header: `Bearer YOUR_JWT_TOKEN`
- Tokens expire in 7 days by default
- Users can only access their own tasks

## User Roles

- `USER` - Default role, can manage own tasks
- `ADMIN` - Administrative role (future use)

## Database Schema

### User Model
- `id` - UUID primary key
- `email` - Unique email address
- `password` - Hashed password
- `name` - Optional user name
- `role` - User role (USER/ADMIN)
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Task Model
- `id` - UUID primary key
- `title` - Task title
- `description` - Optional task description
- `status` - Task status (PENDING/IN_PROGRESS/COMPLETED)
- `priority` - Task priority (LOW/MEDIUM/HIGH)
- `userId` - Foreign key to User
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

## Scripts

- `npm start` - Start the server
- `npm run seed` - Seed the database with test data
- `npx prisma studio` - Open Prisma Studio for database management
- `npx prisma migrate dev` - Run database migrations
- `npx prisma generate` - Generate Prisma client

## Notes

- Data is persisted in PostgreSQL database
- Passwords are hashed using bcrypt
- All user inputs are validated
- JWT tokens are used for stateless authentication
- Users can only access their own tasks (data isolation)
- API includes comprehensive error handling and logging and rate limiting