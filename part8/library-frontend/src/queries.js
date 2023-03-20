import { gql } from "@apollo/client"

export const ALL_AUTHORS = gql`
	query {
		allAuthors {
			name
			born
			bookCount
		}
	}
`
export const ALL_BOOKS = gql`
	query {
		allBooks {
			title
			author
			published
		}
	}
`

export const CREATE_BOOKS = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
  addBook(
    title: $title,
    author: $author,
    published: $published,
    genres: $genres
	)
   {
    title
    author
    published
    genres
  }
}
`

export const UPDATE_BIRTHYEAR = gql`
mutation editAuthor($name: String!, $setBornTo: Int!) {
  editAuthor(name: $name, setBornTo: $setBornTo) {
    name
    born
		bookCount
  }
}
`
