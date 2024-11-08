// src/graphql/schema.ts
import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    getTransactions: [Transaction!]!
  }

  type Mutation {
    createTransaction(description: String!, amount: Float!, date: String!, type: String!, category: String!): Transaction
    updateTransaction(id: ID!, description: String, amount: Float, date: String, type: String, category: String): Transaction
    deleteTransaction(id: ID!): Boolean
}

  type Transaction {
    id: ID!
    description: String!
    amount: Float!
    date: String!
    type: String!
    category: String!
  }
`;
