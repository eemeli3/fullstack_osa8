const { GraphQLError } = require("graphql/error");
const jwt = require("jsonwebtoken");
const User = require("./models/user");
const Author = require("./models/author");
const Book = require("./models/book");
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),

    authorCount: async () => Author.collection.countDocuments(),

    allBooks: async (root, args) => {
      let filter = {};
      if (args.genre && args.genre !== "all genres") {
        filter.genres = args.genre;
      }
      if (args.author) {
        const author = await Author.findOne({ name: args.author });
        filter.author = author._id;
      }
      const returnedBooks = await Book.find(filter).populate("author");
      return returnedBooks;
    },

    allAuthors: async () => {
      const authors = await Author.find({});
      return authors;
    },

    me: (root, args, context) => {
      return context.currentUser;
    },
  },

  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError(`not authenticated`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }
      const authorExists = await Author.exists({ name: args.author });
      if (!authorExists) {
        const author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new GraphQLError(`Saving author failed: ${error.message}`, {
            extensions: {
              code: "BAD_USER_INPUT",
              invalidArgs: args.name,
              error,
            },
          });
        }
      }
      const authorInfo = await Author.findOne({ name: args.author });
      const { author, ...rest } = args;
      const book = new Book({ author: authorInfo._id, ...rest });
      try {
        await book.save();
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }

      try {
        authorInfo.bookCount = authorInfo.bookCount + 1;
        await authorInfo.save();
      } catch (error) {
        throw new GraphQLError(`Saving author failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      }

      const savedBook = await Book.findOne({ title: args.title }).populate(
        "author",
      );

      pubsub.publish("BOOK_ADDED", { bookAdded: savedBook });

      return savedBook;
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError(`not authenticated`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
          },
        });
      }
      const author = await Author.findOne({ name: args.name });
      if (!author) {
        return null;
      }
      author.born = args.setBornTo;

      return author.save().catch((error) => {
        throw new GraphQLError(`Saving author failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      });
    },

    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },

    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },

    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode");
      }
      await Author.deleteMany({});
      await Book.deleteMany({});
      await User.deleteMany({});
      return true;
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator(["BOOK_ADDED"]),
    },
  },
};

module.exports = resolvers;
