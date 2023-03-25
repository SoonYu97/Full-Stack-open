import { gql } from "@apollo/client"

const AUTHOR_DETAILS = gql`
	fragment AuthorDetails on Author {
		name
		born
		bookCount
	}
`
const BOOK_DETAILS = gql`
	fragment BookDetails on Book {
		title
		author {
			...AuthorDetails
		}
		published
		genres
	}
  ${AUTHOR_DETAILS}
`

export const ME = gql`
	query {
		me {
			favoriteGenre
			username
		}
	}
`

export const ALL_AUTHORS = gql`
	query {
		allAuthors {
			...AuthorDetails
		}
	}
	${AUTHOR_DETAILS}
`

export const ALL_GENRES = gql`
	query {
		allGenres
	}
`

export const ALL_BOOKS = gql`
	query {
		allBooks {
			...BookDetails
		}
	}
	${BOOK_DETAILS}
`

export const CREATE_BOOKS = gql`
	mutation createBook(
		$title: String!
		$author: String!
		$published: Int!
		$genres: [String!]!
	) {
		addBook(
			title: $title
			author: $author
			published: $published
			genres: $genres
		) {
			...BookDetails
		}
	}
	${BOOK_DETAILS}
`

export const UPDATE_BIRTHYEAR = gql`
	mutation editAuthor($name: String!, $setBornTo: Int!) {
		editAuthor(name: $name, setBornTo: $setBornTo) {
			...AuthorDetails
		}
	}
	${AUTHOR_DETAILS}
`

export const LOGIN = gql`
	mutation login($username: String!, $password: String!) {
		login(username: $username, password: $password) {
			value
		}
	}
`

export const BOOK_ADDED = gql`
	subscription {
		bookAdded {
			...BookDetails
		}
	}
  ${BOOK_DETAILS}
`
