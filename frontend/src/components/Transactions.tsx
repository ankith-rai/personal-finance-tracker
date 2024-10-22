import React from "react";
import { useQuery } from "@apollo/client";
import { GET_TRANSACTIONS } from "../graphql/queries";

const Transactions: React.FC = () => {
  const { loading, error, data } = useQuery(GET_TRANSACTIONS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <ul>
      {data.getTransactions.map((transaction: any) => (
        <li key={transaction.id} className="border-b py-2">
          {transaction.description}: ${transaction.amount} on {transaction.date}
        </li>
      ))}
    </ul>
  );
};

export default Transactions;
