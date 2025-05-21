import React, { useState } from "react";
import { ApolloProvider, InMemoryCache, ApolloClient, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { Container } from '@mui/material';
import Transactions from "./components/Transactions";
import LoginPage from "./components/Login";
import SignUp from "./components/SignUp";
import NavBar from "./components/NavBar";
import { SessionProvider } from "./context/SessionContext";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  if (networkError) console.error(`[Network error]: ${networkError}`);
});

const httpLink = new HttpLink({
  uri: "http://localhost:4000"
});

const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('transactions');

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignUp />;
      case 'transactions':
      default:
        return <Transactions />;
    }
  };

  return (
    <ApolloProvider client={client}>
      <SessionProvider>
        <NavBar currentPage={currentPage} onNavigate={setCurrentPage} />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {renderPage()}
        </Container>
      </SessionProvider>
    </ApolloProvider>
  );
};

export default App;
