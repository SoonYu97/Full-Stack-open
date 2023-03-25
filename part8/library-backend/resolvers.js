const { GraphQLError } = require("graphql")
const jwt = require("jsonwebtoken")
const { PubSub } = require("graphql-subscriptions")
const pubsub = new PubSub()
const config = require("./utils/config")
const Author = require("./models/author")
const Book = require("./models/book")
const User = require("./models/user")

const resolvers = {
	Query: {
		bookCount: () => Book.find({}).count().exec(),
		authorCount: () => Author.find({}).count().exec(),
		allGenres: () => {
			return Book.distinct("genres").exec()
		},
		allBooks: async (_, args) => {
			if (!args.author && !args.genre)
				return Book.find({}).populate("author", {
					name: 1,
					born: 1,
					bookCount: 1,
					books: 1,
				})
			if (!args.genre)
				return Book.find({
					"author.name": "Robert Martin",
				}).populate("author", {
					name: 1,
					born: 1,
					bookCount: 1,
					books: 1,
				})
			if (!args.author)
				return Book.find({ genres: args.genre }).populate("author", {
					name: 1,
					born: 1,
					bookCount: 1,
					books: 1,
				})
			return Book.find({ genres: args.genre }).populate("author", {
				name: 1,
				born: 1,
				bookCount: 1,
				books: 1,
			})
		},
		allAuthors: async () =>
			Author.find({}).populate("books", { title: 1, genres: 1, published: 1 }),
		me: (_, __, context) => {
			return context.currentUser
		},
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
				author = new Author({ name: authorName, books: [] })
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

			await Author.updateOne({ name: authorName }, { $push: { books: book } })

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

			pubsub.publish("BOOK_ADDED", { bookAdded: book })
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
		bookCount: async (root) => root.books?.length || 0,
	},
	Subscription: {
		bookAdded: {
			subscribe: () => pubsub.asyncIterator("BOOK_ADDED"),
		},
	},
}

module.exports = resolvers
