import { useState } from "react"
import { useMutation } from "@apollo/client"

import { updateCache } from "../App"
import { CREATE_BOOKS, ALL_BOOKS, ALL_GENRES } from "../queries"

const NewBook = ({ setError }) => {
	const [title, setTitle] = useState("")
	const [author, setAuthor] = useState("")
	const [published, setPublished] = useState("")
	const [genre, setGenre] = useState("")
	const [genres, setGenres] = useState([])

	const [createBook] = useMutation(CREATE_BOOKS, {
		onError: (error) => {
			setError(error.graphQLErrors[0]?.message)
			setTimeout(() => {
				setError("")
			}, 3000)
		},
		update: (cache, response) => {
			updateCache(cache, { query: ALL_BOOKS }, response.data.addBook)
			cache.updateQuery({ query: ALL_GENRES }, ({ allGenres }) => {
				const genresSet = new Set([
					...allGenres,
					...response.data.addBook.genres,
				])
				return {
					allGenres: [...genresSet],
				}
			})
		},
	})

	const submit = async (event) => {
		event.preventDefault()

		createBook({
			variables: { title, author, published: Number(published), genres },
		})

		setTitle("")
		setPublished("")
		setAuthor("")
		setGenres([])
		setGenre("")
	}

	const addGenre = () => {
		setGenres(genres.concat(genre))
		setGenre("")
	}

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					title
					<input
						value={title}
						onChange={({ target }) => setTitle(target.value)}
					/>
				</div>
				<div>
					author
					<input
						value={author}
						onChange={({ target }) => setAuthor(target.value)}
					/>
				</div>
				<div>
					published
					<input
						type="number"
						value={published}
						onChange={({ target }) => setPublished(target.value)}
					/>
				</div>
				<div>
					<input
						value={genre}
						onChange={({ target }) => setGenre(target.value)}
					/>
					<button onClick={addGenre} type="button">
						add genre
					</button>
				</div>
				<div>genres: {genres.join(" ")}</div>
				<button type="submit">create book</button>
			</form>
		</div>
	)
}

export default NewBook
