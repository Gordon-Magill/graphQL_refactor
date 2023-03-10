// Import GQL to be able to define types, queries, and mutations
const { gql } = require("apollo-server-express");

// Define types, queries, and mutations based on mongoDB models in ../models
const typeDefs = gql`
  type User {
    _id: ID!
    username: String!
    email: String
    savedBooks: [Book]
    bookCount: Int
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String!
    image: String
    link: String
    title: String!
  }

  type Auth {
    token: ID!
    user: User
  }

  input BookInput {
    bookId: String!
    authors: [String]
    description: String!
    image: String
    link: String
    title: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookInfo: BookInput!): User
    removeBook(bookId: ID!): User
  }
`;

module.exports = typeDefs;
