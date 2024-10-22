# Personal Finance Tracker - Backend

This is the backend service for the Personal Finance Tracker Application. The backend is built using **Node.js**, **GraphQL**, and **PostgreSQL**. It provides APIs for managing transactions.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Available Scripts](#available-scripts)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)

## Prerequisites
- **Node.js** (v14 or higher)
- **PostgreSQL** (for storing transaction data)
- **AWS CLI** (optional, for cloud integration)
- **Docker** (optional, for containerization)

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/personal-finance-tracker.git
cd personal-finance-tracker/backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the `/backend` directory with the following variables:
```
PORT=4000
DATABASE_URL=postgres://username:password@localhost:5432/finance_tracker
```

### 4. Start the Server
```bash
npm run dev
```
This will start the server on [http://localhost:4000](http://localhost:4000).

## Database Setup

### 1. Create the PostgreSQL Database
Make sure you have PostgreSQL installed and running locally. You can create the database using the following SQL commands:

```sql
CREATE DATABASE finance_tracker;
```

Then, create the necessary tables using SQL or a migration tool.

### 2. Create the Transactions Table

```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  date DATE NOT NULL,
  type VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Available Scripts
- **`npm run dev`**: Start the development server using **nodemon**.
- **`npm run build`**: Build the production version of the app.
- **`npm run start`**: Run the production build of the app.

## Folder Structure
```
backend/
├── src/
│   ├── index.ts         # Entry point for the backend
│   ├── resolvers/       # GraphQL resolvers
│   ├── typeDefs/        # GraphQL type definitions
│   ├── models/          # Database models (if any)
├── .env                 # Environment variables
├── package.json         # Dependencies and scripts
├── README.md            # Backend documentation
```

## Technologies Used
- **Node.js**: Backend runtime environment
- **GraphQL**: API specification
- **PostgreSQL**: Relational database
- **TypeScript**: Type-safe JavaScript
- **Docker**: (Optional) Containerization for the backend service
