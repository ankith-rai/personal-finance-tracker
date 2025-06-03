// src/graphql/schema.ts
import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    getTransactions: [Transaction!]!
    getInvoices: [Invoice!]!
    me: User
  }

  type Mutation {
    createTransaction(description: String!, amount: Float!, date: String!, type: String!, category: String!): Transaction
    updateTransaction(id: ID!, description: String, amount: Float, date: String, type: String, category: String): Transaction
    deleteTransaction(id: ID!): Boolean
    signUp(email: String!, password: String!, name: String!): AuthPayload!
    signIn(email: String!, password: String!): AuthPayload!
    createInvoice(transactions: [ID!]!, clientName: String!, clientEmail: String!, dueDate: String!): Invoice!
}

  type Transaction {
    id: ID!
    description: String!
    amount: Float!
    date: String!
    type: String!
    category: String!
    user: User!
  }

  type User {
    id: ID!
    email: String!
    name: String!
    transactions: [Transaction!]!
    invoices: [Invoice!]!
  }

  type Invoice {
    id: ID!
    number: String!
    clientName: String!
    clientEmail: String!
    dueDate: String!
    total: Float!
    status: String!
    transactions: [Transaction!]!
    user: User!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }
`;
