const express = require("express");
const path = require("path");
const db = require("./config/connection");

// New import of Apollo Server to implement graphQL on top of mongoDB
const { ApolloServer } = require("apollo-server-express");

// New middleware needs to be implemented to handle authentication
// This chunk already appears effectively done, just need to reference it
const { authMiddleware } = require("./utils/auth");

// New definitions of graphQL queries and mutations for use with Apollo
const { typeDefs, resolvers } = require("./newSchema");

// Routing will be handled using React components and not separate express routes
// const routes = require('./routes');

// Generate the express app and associated port
const app = express();
const PORT = process.env.PORT || 3001;

// Apply generic Express middlewares for handling JSON content
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../client/build")));
}

// SPA doesn't need no stinking routes (or at least routes handled outside of React)
// app.use(routes);

// Configure the new Apollo wrapper for graphQL / mongoDB
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

// In substitution of normal routes, just have all requests go the SPA index.html
// Make sure you've done at least one build so this file actually exists!
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

// Apply new Apollo server around the express Server
const startApolloServer = async (typeDefs, resolvers) => {
  // Pause execution for Apollo to start
  await server.start();

  // Make Apollo aware of middleware stemming from Express server
  server.applyMiddleware({ app });

  // Start the underlying mongoDB db + start the app
  db.once("open", () => {
    app.listen(PORT, () =>
      console.log(`🌍 Now listening on localhost:${PORT}`)
    );
  });
};
