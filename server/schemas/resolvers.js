// Import the main data types
const { User } = require("../models/");

// Import the token signing / creation function for use with login functionality
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context, info) => {
      console.log("me query resolver activated");
      // console.log("context:", context);
      // If the authentication middleware didn't attach user info, send an alert
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
      console.log("login server mutation resolver triggered");
      console.log(args);
      // Find any users that have the same email submitted in the login attempt
      const user = await User.findOne({ email: args.email });
      console.log(`user:`, user);
      if (!user) {
        console.log("Login mutation resolver error: incorrect user email");
      } else {
        // Verify that the provided password matches that of the found User
        const pwCheck = user.isCorrectPassword(args.password);
        if (!pwCheck) {
          console.log("Login mutation resolver error: incorrect user password");
        } else {
          // Provide a an Auth object for the valid user
          const token = signToken(user);
          console.log({ token, user });
          return { token, user };
        }
      }
    },

    addUser: async (parent, args, context, info) => {
      console.log("addUser mutation resolver activated on server");
      console.log(`addUser args:`, args);
      // Args should be defined in typeDefs - in this case can just dump the whole args in since it's named correctly on the other end
      const user = await User.create(args);

      // Create a new login token for the created user

      const token = signToken(user);

      // Return the equivalent of an Auth object
      console.log("addUser mutation resolver completed on server");
      console.log("token:", token);
      console.log("user:", user);
      return { token, user };
    },

    saveBook: async (parent, args, context, info) => {
      console.log("saveBook mutation resolver activated");
      // console.log("saveBook this:", this);
      // console.log("saveBook parent:", parent);
      console.log("saveBook args.bookInfo:", args.bookInfo);
      console.log("saveBook context.user._id:", context.user._id);
      // console.log("saveBook info:", info);

      if (context.user) {
        const newBookUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          {
            $push: {
              savedBooks: args.bookInfo,
            },
          },
          { new: true }
        );
        console.log("newBookUser:", newBookUser);
        return newBookUser;
      } else {
        console.log("saveBook Resolver: No authenticated user in context");
      }
    },

    removeBook: async (parent, { bookId }, context, info) => {
      console.log("removeBook mutation resolver activated");
      // console.log("removeBook this:", this);
      // console.log("removeBook parent:", parent);
      console.log("removeBook bookId:", bookId);
      console.log("removeBook context.user._id:", context.user._id);
      // console.log("removeBook info:", info);

      if (context.user) {
        const removeBookUser = User.findByIdAndUpdate(
          { _id: context.user._id },
          {
            $pull: {
              savedBooks: { bookId },
            },
          },
          { new: true }
        );

        return removeBookUser;
      } else {
        console.log("removeBook Resolver: No authenticated user in context");
      }
    },
  },
};

module.exports = resolvers;
