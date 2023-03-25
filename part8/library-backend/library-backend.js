const { ApolloServer } = require("@apollo/server")
const { startStandaloneServer } = require("@apollo/server/standalone")
const mongoose = require("mongoose")
const { GraphQLError } = require("graphql")
const jwt = require("jsonwebtoken")

const config = require("./utils/config")

mongoose.set("strictQuery", false)

const Author = require("./models/author")
const Book = require("./models/book")
const User = require("./models/user")

mongoose
	.connect(config.MONGODB_URI)
	.then(() => {
		console.log("connected to MongoDB")
	})
	.catch((error) => {
		console.log("error connection to MongoDB:", error.message)
	})

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
		allGenres: [String!]!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book!
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
`
const resolvers = {
	Query: {
		bookCount: () => Book.find({}).count(),
		authorCount: () => Author.find({}).count(),
		allGenres: () => {
			return Book.distinct("genres").exec()
		},
		allBooks: async (_, args) => {
			if (!args.author && !args.genre)
				return Book.find({}).populate("author", {
					name: 1,
					born: 1,
					bookCount: 1,
				})
			if (!args.genre)
				return Book.find({
					"author.name": "Robert Martin",
				}).populate("author", {
					name: 1,
					born: 1,
					bookCount: 1,
				})
			if (!args.author)
				return Book.find({ genres: args.genre }).populate("author", {
					name: 1,
					born: 1,
					bookCount: 1,
				})
			return Book.find({ genres: args.genre }).populate("author", {
				name: 1,
				born: 1,
				bookCount: 1,
			})
		},
		allAuthors: async () => Author.find({}),
    me: (_, __, context) => {
      return context.currentUser
    }
	},
	Mutation: {
		addBook: async (_, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Saving book failed", {
					extensions: {
						code: "UNAUTHORIZE",
					},
				})
      }
			const { author: authorName, ...bookArgs } = args
			if (bookArgs.title.length < 5) {
				throw new GraphQLError("Saving book failed", {
					extensions: {
						code: "TITLE_LENGTH_LESS_THAN_FIVE",
						invalidArgs: bookArgs.title,
					},
				})
			}
			if (authorName.length < 4) {
				throw new GraphQLError("Saving author failed", {
					extensions: {
						code: "AUTHOR_LENGTH_LESS_THAN_FOUR",
						invalidArgs: authorName,
					},
				})
			}
			let author = await Author.findOne({ name: authorName })
			if (!author) {
				author = new Author({ name: authorName })
				try {
					await author.save()
				} catch (error) {
					throw new GraphQLError("Saving author failed", {
						extensions: {
							code: "BAD_USER_INPUT",
							invalidArgs: authorName,
							error,
						},
					})
				}
			}
			const book = new Book({ ...bookArgs, author })

			try {
				await book.save()
			} catch (error) {
				throw new GraphQLError("Saving book failed", {
					extensions: {
						code: "BAD_USER_INPUT",
						invalidArgs: bookArgs,
						error,
					},
				})
			}

			return book
		},
		editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError("Editing author failed", {
					extensions: {
						code: "UNAUTHORIZE",
					},
				})
      }
			const author = await Author.findOne({ name: args.name })
			if (!author) {
				return null
			}
			author.born = args.setBornTo
			return author.save()
		},
		createUser: async (root, args) => {
			const user = new User({
				username: args.username,
				favoriteGenre: args.favoriteGenre,
			})

			return user.save().catch((error) => {
				throw new GraphQLError("Creating the user failed", {
					extensions: {
						code: "BAD_USER_INPUT",
						invalidArgs: args.name,
						error,
					},
				})
			})
		},
		login: async (_, args) => {
			const user = await User.findOne({ username: args.username })

			if (!user || args.password !== "secret") {
				throw new GraphQLError("wrong credentials", {
					extensions: {
						code: "BAD_USER_INPUT",
					},
				})
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			}

			return { value: jwt.sign(userForToken, config.JWT_SECRET) }
		},
	},
	Author: {
		name: (root) => root.name,
		born: (root) => root.born,
		id: (root) => root.id,
		bookCount: async (root) => Book.find({ "author.name": root.name }).count(),
	},
}

const server = new ApolloServer({
	typeDefs,
	resolvers,
})

startStandaloneServer(server, {
	listen: { port: 4000 },
  context: async ({ req, res }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.startsWith('Bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), config.JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  },
}).then(({ url }) => {
	console.log(`Server ready at ${url}`)
})
