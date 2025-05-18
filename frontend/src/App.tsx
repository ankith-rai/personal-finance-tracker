import React from "react";
import { ApolloProvider, InMemoryCache, ApolloClient } from "@apollo/client";
import Transactions from "./components/Transactions";
import LoginPage from "./components/Login";

const client = new ApolloClient({
  uri: "http://localhost:4000",
  cache: new InMemoryCache(),
});

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Finance Tracker</h1>
      <Transactions />
    </div>
    <div>
      <LoginPage />
    </div>
  </ApolloProvider>
);

export default App;
