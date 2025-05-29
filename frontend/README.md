# Personal Finance Tracker Frontend

This is the frontend for the Personal Finance Tracker application. It provides a modern, responsive UI for managing your finances, built with React, TypeScript, Material UI v6, and Apollo Client.

## Features
- User sign up and sign in
- Add, update, and delete finance transactions
- Create and view invoices
- Responsive, modern UI (Material UI v6)
- GraphQL integration with Apollo Client

## Prerequisites
- Node.js (v16+ recommended)
- The backend server running (see `../backend/README.md`)

## Install Dependencies
```sh
npm install
```

## Running the Frontend
```sh
npm run dev
```

The app will start on [http://localhost:5173](http://localhost:5173) by default (Vite).

## Environment
- By default, the frontend expects the backend GraphQL API at `http://localhost:4000`.
- If your backend runs elsewhere, update the URI in `src/App.tsx`.

## Project Structure
- `src/components/` - React components (Login, SignUp, Transactions, Invoices, NavBar)
- `src/context/` - Authentication context
- `src/graphql/` - GraphQL queries
- `src/App.tsx` - Main app and routing

## UI/UX
- Built with Material UI v6 for a modern, accessible, and responsive experience
- Two-column responsive login page
- Mobile-friendly navigation

---

For the backend, see the `../backend/README.md` file.
