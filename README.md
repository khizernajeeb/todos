# Todo API

A RESTful API for managing todos built with Fastify, TypeScript, and PostgreSQL.

## Features

- Full CRUD operations
- Input validation
- Error handling
- Database migrations
- Docker support

## Setup

1. Clone repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run migrations: `npm run migrate`
5. Start server: `npm run dev`

## API Endpoints

- GET /api/todos - Get all todos
- GET /api/todos/:id - Get single todo
- POST /api/todos - Create todo
- PUT /api/todos/:id - Update todo
- DELETE /api/todos/:id - Delete todo

## Environment Variables

- DATABASE_URL - PostgreSQL connection string
- PORT - Server port (default: 3000)
