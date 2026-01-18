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

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $description: String, $amount: Float, $date: String, $type: String, $category: String) {
    updateTransaction(id: $id, description: $description, amount: $amount, date: $date, type: $type, category: $category) {
      id
      description
      amount
      date
      type
      category
    }
  }
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;

export const UPDATE_INVOICE = gql`
  mutation UpdateInvoice($id: ID!, $clientName: String, $clientEmail: String, $dueDate: String, $status: String) {
    updateInvoice(id: $id, clientName: $clientName, clientEmail: $clientEmail, dueDate: $dueDate, status: $status) {
      id
      number
      clientName
      clientEmail
      dueDate
      total
      status
    }
  }
`;

export const DELETE_INVOICE = gql`
  mutation DeleteInvoice($id: ID!) {
    deleteInvoice(id: $id)
  }
`;
