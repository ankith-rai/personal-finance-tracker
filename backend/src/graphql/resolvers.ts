// src/graphql/resolvers.ts
import pool from '../db';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
}

export const resolvers = {
  Query: {
    getTransactions: async (): Promise<Transaction[]> => {
      const result = await pool.query('SELECT * FROM transactions');
      return result.rows;
    },
  },
};
