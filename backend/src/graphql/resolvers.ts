import { pool, hashPassword, comparePassword, generateToken } from '../db';
import { AuthenticationError, UserInputError } from 'apollo-server';

interface User {
  id: number;
  email: string;
  name: string;
}

interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: string;
  category: string;
  user_id: number;
  invoice_id?: number;
}

interface Invoice {
  id: number;
  number: string;
  client_name: string;
  client_email: string;
  due_date: string;
  total: number;
  status: string;
  user_id: number;
}

interface Context {
  user?: User;
}

export const resolvers = {
  Query: {
    me: async (_: any, __: any, { user }: Context) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      const result = await pool.query('SELECT id, email, name FROM users WHERE id = $1', [user.id]);
      return result.rows[0];
    },
    getTransactions: async (_: any, __: any, { user }: Context) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      const result = await pool.query('SELECT * FROM transactions WHERE user_id = $1', [user.id]);
      return result.rows;
    },
    getInvoices: async (_: any, __: any, { user }: Context) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      const result = await pool.query('SELECT * FROM invoices WHERE user_id = $1', [user.id]);
      return result.rows;
    },
  },
  Mutation: {
    signUp: async (_: any, { email, password, name }: { email: string; password: string; name: string }) => {
      const hashedPassword = await hashPassword(password);
      try {
        const result = await pool.query(
          'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name',
          [email, hashedPassword, name]
        );
        const user = result.rows[0];
        const token = generateToken(user.id);
        return { token, user };
      } catch (error) {
        throw new UserInputError('Email already exists');
      }
    },
    signIn: async (_: any, { email, password }: { email: string; password: string }) => {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      const user = result.rows[0];
      if (!user) throw new UserInputError('Invalid credentials');
      
      const valid = await comparePassword(password, user.password);
      if (!valid) throw new UserInputError('Invalid credentials');
      
      const token = generateToken(user.id);
      return { token, user: { id: user.id, email: user.email, name: user.name } };
    },
    createTransaction: async (
      _: any,
      { description, amount, date, type, category }: { description: string; amount: number; date: string; type: string; category: string },
      { user }: Context
    ) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      const result = await pool.query(
        'INSERT INTO transactions (description, amount, date, type, category, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [description, amount, date, type, category, user.id]
      );
      return result.rows[0];
    },
    createInvoice: async (
      _: any,
      { transactions, clientName, clientEmail, dueDate }: { transactions: number[]; clientName: string; clientEmail: string; dueDate: string },
      { user }: Context
    ) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      
      // Start a transaction
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        
        // Calculate total
        const totalResult = await client.query(
          'SELECT SUM(amount) as total FROM transactions WHERE id = ANY($1) AND user_id = $2',
          [transactions, user.id]
        );
        const total = totalResult.rows[0].total;
        
        // Generate invoice number
        const invoiceNumber = `INV-${Date.now()}`;
        
        // Create invoice
        const invoiceResult = await client.query(
          'INSERT INTO invoices (number, client_name, client_email, due_date, total, status, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
          [invoiceNumber, clientName, clientEmail, dueDate, total, 'PENDING', user.id]
        );
        const invoice = invoiceResult.rows[0];
        
        // Assign transactions to invoice
        await client.query(
          'UPDATE transactions SET invoice_id = $1 WHERE id = ANY($2) AND user_id = $3',
          [invoice.id, transactions, user.id]
        );
        
        await client.query('COMMIT');
        return invoice;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
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
  User: {
    transactions: async (parent: User) => {
      const result = await pool.query('SELECT * FROM transactions WHERE user_id = $1', [parent.id]);
      return result.rows;
    },
    invoices: async (parent: User) => {
      const result = await pool.query('SELECT * FROM invoices WHERE user_id = $1', [parent.id]);
      return result.rows;
    },
  },
  Invoice: {
    transactions: async (parent: Invoice) => {
      const result = await pool.query(
        'SELECT * FROM transactions WHERE invoice_id = $1',
        [parent.id]
      );
      return result.rows;
    },
    user: async (parent: Invoice) => {
      const result = await pool.query('SELECT id, email, name FROM users WHERE id = $1', [parent.user_id]);
      return result.rows[0];
    },
  },
  Transaction: {
    user: async (parent: Transaction) => {
      const result = await pool.query('SELECT id, email, name FROM users WHERE id = $1', [parent.user_id]);
      return result.rows[0];
    },
    invoiceId: (parent: Transaction) => parent.invoice_id,
  },
};
