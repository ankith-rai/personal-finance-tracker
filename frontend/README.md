# Personal Finance Tracker - Frontend

This is the frontend application for the Personal Finance Tracker. It is built using **React (Vite)** with **TypeScript**, styled with **Tailwind CSS**, and uses **Apollo Client** for interacting with the backend GraphQL API.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Folder Structure](#folder-structure)
- [Technologies Used](#technologies-used)

## Prerequisites
- **Node.js** (v14 or higher)
- **npm** or **yarn**

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/personal-finance-tracker.git
cd personal-finance-tracker/frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Frontend
```bash
npm run dev
```

This will start the frontend development server on [http://localhost:3000](http://localhost:3000).

## Available Scripts
- **`npm run dev`**: Start the Vite development server.
- **`npm run build`**: Build the production version of the app.
- **`npm run serve`**: Serve the production build.

## Folder Structure
```
frontend/
├── public/
├── src/
│   ├── components/      # React components
│   ├── apollo-client.ts # Apollo Client configuration
│   ├── App.tsx          # Main app component
│   ├── index.tsx        # Entry point for React
│   ├── styles/          # Tailwind CSS configuration
├── package.json         # Dependencies and scripts
├── tailwind.config.js   # Tailwind CSS configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
├── README.md            # Frontend documentation
```

## Technologies Used
- **React (Vite)**: Frontend framework for building UI components
- **TypeScript**: Type-safe JavaScript
- **Apollo Client**: GraphQL client for data fetching
- **Tailwind CSS**: Utility-first CSS framework for styling
- **GraphQL**: API specification
