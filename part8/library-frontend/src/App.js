import { useState, useEffect } from "react"
import { Routes, Route, Link, useNavigate } from "react-router-dom"
import { useApolloClient } from "@apollo/client"
import { useSubscription } from "@apollo/client"

import { BOOK_ADDED, ALL_BOOKS, ALL_GENRES } from "./queries"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm.js"
import Recommendations from "./components/Recommendation"

export const updateCache = (cache, query, addedBook) => {
  // helper that is used to eliminate saving same person twice
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }

  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
	const [token, setToken] = useState(null)
	const [error, setError] = useState(null)
	const client = useApolloClient()
	const navigate = useNavigate()

	const logout = () => {
		setToken(null)
		localStorage.clear()
		client.resetStore()
		navigate("/")
	}

	useEffect(() => {
		setToken(localStorage.getItem("library-user-token"))
	}, [])

	useSubscription(BOOK_ADDED, {
		onData: ({ data }) => {
			const addedBook = data.data.bookAdded
			window.alert(`book added: ${addedBook.title}`)

			updateCache(client.cache, {query: ALL_BOOKS}, addedBook)
			client.cache.updateQuery({ query: ALL_GENRES }, ({ allGenres }) => {
				const genresSet = new Set([...allGenres, ...addedBook.genres])
				return {
					allGenres: [...genresSet],
				}
			})
		},
	})

	return (
		<div>
			<div>
				<p>{error}</p>
				<Link to="/">authors</Link>
				<Link to="/books">books</Link>
				{token ? (
					<>
						<Link to="/add">add book</Link>
						<Link to="/recommendation">recommend</Link>
						<button onClick={() => logout()}>logout</button>
					</>
				) : (
					<Link to="/login">login</Link>
				)}
			</div>

			<Routes>
				<Route
					path="/"
					element={<Authors token={token} setError={setError} />}
				/>
				<Route path="/books" element={<Books />} />
				<Route path="/add" element={<NewBook setError={setError} />} />
				<Route path="/recommendation" element={<Recommendations />} />
				<Route
					path="/login"
					element={<LoginForm setToken={setToken} setError={setError} />}
				/>
			</Routes>
		</div>
	)
}

export default App
