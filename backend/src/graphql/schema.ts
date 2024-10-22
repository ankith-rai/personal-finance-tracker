// src/graphql/schema.ts
import { gql } from 'apollo-server';

export const typeDefs = gql`
  type Query {
    getTransactions: [Transaction!]!
  }

  type Transaction {
    id: ID!
    description: String!
    amount: Float!
    date: String!
  }
`;
