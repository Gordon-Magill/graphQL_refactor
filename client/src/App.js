import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchBooks from "./pages/SearchBooks";
import SavedBooks from "./pages/SavedBooks";
import Navbar from "./components/Navbar";

// Add in new Apollo components
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Create base endpoint for all graphQL queries
const gqlLink = createHttpLink({
  uri: "/graphql",
});

// Create context on each request w/ token info
const tokenContext = setContext((_, { headers }) => {
  // Use localstorage if it's available
  const token = localStorage.getItem("id_token");
  console.log("retrieved token from localstorage:", token);
  const tokenContent = token ? `Bearer ${token}` : ``;

  // Return modified headers
  return {
    ...headers,
    authorization: tokenContent,
  };
});

// Create new ApolloClient for use by ApolloProvider
const apolloClient = new ApolloClient({
  link: tokenContext.concat(gqlLink),
  cache: new InMemoryCache(),
});

// Wrapping page content w/ ApolloProvider so that all pages get access
function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<SearchBooks />} />
            <Route path="/saved" element={<SavedBooks />} />
            <Route
              path="*"
              element={<h1 className="display-2">Wrong page!</h1>}
            />
          </Routes>
        </>
      </Router>
    </ApolloProvider>
  );
}

export default App;
