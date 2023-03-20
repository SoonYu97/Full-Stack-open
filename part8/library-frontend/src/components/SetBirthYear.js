import { useState } from "react"
import { useMutation } from "@apollo/client"

import { UPDATE_BIRTHYEAR, ALL_AUTHORS } from "../queries"

const SetBirthYear = () => {
	const [name, setName] = useState("")
	const [born, setBorn] = useState("")

	const [editAuthor] = useMutation(UPDATE_BIRTHYEAR, {
		refetchQueries: [{ query: ALL_AUTHORS }],
	})

	const submit = async (event) => {
		event.preventDefault()

		console.log("update birth year...")
		editAuthor({
			variables: { name, setBornTo: Number(born) },
		})

		setName("")
		setBorn("")
	}

	return (
		<div>
			<h3>Set birthyear</h3>
			<form onSubmit={submit}>
				<div>
					name
					<input
						value={name}
						onChange={({ target }) => setName(target.value)}
					/>
				</div>
				<div>
					born
					<input
						type="number"
						value={born}
						onChange={({ target }) => setBorn(target.value)}
					/>
				</div>
				<button type="submit">update author</button>
			</form>
		</div>
	)
}

export default SetBirthYear
