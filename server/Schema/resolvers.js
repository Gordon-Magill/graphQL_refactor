// Import the main data types
const { User } = require("../models");

// Import the token signing / creation function for use with login functionality
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context, info) => {
      // If the authentication middleware didn't attach user info
      if (context.user) {
        const user = await User.findOne({ _id: context.user._id }).select(
          "-password"
        );
        return user;
      } else {
        console.log("Me query resolver error: no user context / not logged in");
      }
    },
  },
  Mutation: {
    login: async (parent, args, context, info) => {
      // Find any users that have the same email submitted in the login attempt
      const user = await User.findOne({ email: args.email });
      if (!user) {
        console.log("Login mutation resolver error: incorrect user emaail");
      } else {
        // Verify that the provided password matches that of the found User
        const pwCheck = user.isCorrectPassword(args.password);
        if (!pwCheck) {
          console.log("Login mutation resolver error: incorrect user password");
        } else {
          // Provide a an Auth object for the valid user
          const newToken = signToken(user);
          return { token, user };
        }
      }
    },
    addUser: async (parent, args, context, info) => {},
    saveBook: async (parent, args, context, info) => {},
    removeBook: async (parent, args, context, info) => {},
  },
};

module.exports = resolvers;
