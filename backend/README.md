# Personal Finance Tracker Backend

This is the backend for the Personal Finance Tracker application. It provides a GraphQL API for user authentication, transaction management, and invoice creation.

## Features
- User sign up and sign in (JWT authentication)
- Add, update, and delete finance transactions
- Create and list invoices
- PostgreSQL database
- Apollo Server (GraphQL)

## Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL

## Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_tracker
JWT_SECRET=your_jwt_secret
```

## Database Initialization
- The database tables are automatically created on server startup if they do not exist.
- Ensure your PostgreSQL server is running and the database specified in `DB_NAME` exists.

## Install Dependencies
```sh
npm install
```

## Running the Backend
```sh
npm run dev   # For development (with nodemon)
# or
npm start     # For production
```

The server will start on [http://localhost:4000](http://localhost:4000) by default.

## Project Structure
- `src/db.ts` - Database connection and initialization
- `src/graphql/` - GraphQL schema and resolvers
- `src/index.ts` - Server entry point

## API
- GraphQL endpoint: `/` (root)
- Use tools like Apollo Studio, Postman, or GraphQL Playground to interact with the API.

---

For the frontend, see the `../frontend/README.md` file.
