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
    // login: async (parent, args, context, info) => {
    //   // Find any users that have the same email submitted in the login attempt
    //   const user = await User.findOne({ email: args.email });
    //   if (!user) {
    //     console.log("Login mutation resolver error: incorrect user emaail");
    //   } else {
    //     // Verify that the provided password matches that of the found User
    //     const pwCheck = user.isCorrectPassword(args.password);
    //     if (!pwCheck) {
    //       console.log("Login mutation resolver error: incorrect user password");
    //     } else {
    //       // Provide a an Auth object for the valid user
    //       const newToken = signToken(user);
    //       return { token, user };
    //     }
    //   }
    // },

    addUser: async (parent, args, context, info) => {
      console.log('addUser mutation resolver activated on server')
      // Args should be defined in typeDefs - in this case can just dump the whole args in since it's named correctly on the other end
      const user = await User.create(args);
      // Create a new login token for the created user

      const newToken = signToken(user);

      // Return the equivalent of an Auth object
      return { newToken, user };
    },

    // saveBook: async (parent, args, context, info) => {
    //   console.log("saveBook this:", this);
    //   console.log("saveBook parent:", parent);
    //   console.log("saveBook args:", args);
    //   console.log("saveBook context:", context);
    //   console.log("saveBook info:", info);

    //   if (context.user) {
    //     const newBookUser = await User.findByIdAndUpdate(
    //       { _id: context.user._id },
    //       { new: true },
    //       {
    //         $push: {
    //           savedBooks: args.bookId,
    //         },
    //       }
    //     );
    //     return newBookUser;
    //   } else {
    //     console.log("saveBook Resolver: No authenticated user in context");
    //   }
    // },

    // removeBook: async (parent, args, context, info) => {
    //   if (context.user) {
    //     const removeBookUser = User.findByIdAndUpdate(
    //       { _id: context.user._id },
    //       { new: true },
    //       {
    //         $pull: {
    //           savedBooks: args.bookId,
    //         },
    //       }
    //     );

    //     return removeBookUser;
    //   } else {
    //     console.log("removeBook Resolver: No authenticated user in context");
    //   }
    // },
  },
};

module.exports = resolvers;
