import { gql } from "@apollo/client";

export const GET_TRANSACTIONS = gql`
  query GetTransactions {
    getTransactions {
      id
      description
      amount
      date
      type
      category
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($description: String!, $amount: Float!, $date: String!, $type: String!, $category: String!) {
    createTransaction(description: $description, amount: $amount, date: $date, type: $type, category: $category) {
      id
      description
      amount
      date
      type
      category
    }
  }
`;
