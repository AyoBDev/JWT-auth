# Simple Task Management API

A Node.js and Express REST API with PostgreSQL database using Prisma ORM for managing tasks.

## Features

- RESTful CRUD operations for tasks
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

### Tasks

- `GET /api/tasks` – Returns all tasks (supports pagination and filtering)
  - Query params: `page`, `limit`, `status`, `priority`
- `GET /api/tasks/:id` – Returns a single task by ID
- `POST /api/tasks` – Creates a new task
- `PUT /api/tasks/:id` – Updates an existing task
- `DELETE /api/tasks/:id` – Deletes a task

### Request Body Example
```json
{
  "title": "Build API",
  "description": "Create a task management API",
  "status": "pending",
  "priority": "medium"
}
```

## Validation Rules

- `title` is required and must be at least 3 characters
- `status` must be one of: `pending`, `in-progress`, `completed`
- `priority` must be one of: `low`, `medium`, `high`

## Testing

Test the API using Postman, Insomnia, or curl:

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Task","description":"Testing API"}'
```

## Notes

- Data is persisted in PostgreSQL database