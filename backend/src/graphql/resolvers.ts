import pool from '../db';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: string;
  category: string;
}

export const resolvers = {
  Query: {
    getTransactions: async (): Promise<Transaction[]> => {
      const result = await pool.query('SELECT * FROM transactions');
      return result.rows;
    },
  },
  Mutation: {
    createTransaction: async (
      _: any,
      { description, amount, date, type, category}: { description: string; amount: number; date: string, type: string, category: string }
    ): Promise<Transaction> => {
      const result = await pool.query(
        'INSERT INTO transactions (description, amount, date, type, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [description, amount, date, type, category]
      );
      return result.rows[0];
    },
    updateTransaction: async (
      _: any,
      { id, description, amount, date }: { id: number; description?: string; amount?: number; date?: string }
    ): Promise<Transaction> => {
      const result = await pool.query(
        'UPDATE transactions SET description = COALESCE($1, description), amount = COALESCE($2, amount), date = COALESCE($3, date) WHERE id = $4 RETURNING *',
        [description, amount, date, id]
      );
      return result.rows[0];
    },
    deleteTransaction: async (
      _: any,
      { id }: { id: number }
    ): Promise<boolean> => {
      const result = await pool.query('DELETE FROM transactions WHERE id = $1', [id]);
      return (result.rowCount ?? 0) > 0;
    },
  },
};
