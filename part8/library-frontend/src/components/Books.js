import { useState } from "react"
import { useQuery } from "@apollo/client"

import { ALL_BOOKS, ALL_GENRES } from "../queries"

const Books = () => {
	const [filter, setFilter] = useState("")
	const booksResult = useQuery(ALL_BOOKS)
	const genresResult = useQuery(ALL_GENRES)

	if (booksResult.loading || genresResult.loading) {
		return <div>loading...</div>
	}

	return (
		<div>
			<h2>books</h2>

			<table>
				<tbody>
					<tr>
						<th></th>
						<th>author</th>
						<th>published</th>
					</tr>
					{booksResult.data.allBooks
						.filter((book) =>
							filter === "" ? true : book.genres?.includes(filter)
						)
						.map((a) => (
							<tr key={a.title}>
								<td>{a.title}</td>
								<td>{a.author.name}</td>
								<td>{a.published}</td>
							</tr>
						))}
				</tbody>
			</table>
			<br />
			<div>
				{genresResult.data.allGenres.map((genre) => (
					<button key={genre} onClick={() => setFilter(genre)}>
						{genre}
					</button>
				))}
				<button onClick={() => setFilter("")}>all genres</button>
			</div>
		</div>
	)
}

export default Books
