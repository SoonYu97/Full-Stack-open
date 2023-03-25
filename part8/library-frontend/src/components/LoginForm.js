import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation } from "@apollo/client"

import { LOGIN } from "../queries"

const LoginForm = ({ setToken, setError }) => {
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")

	const navigate = useNavigate()

	const [login, result] = useMutation(LOGIN, {
		onError: (error) => {
			setError(error.graphQLErrors[0].message)
			setTimeout(() => {
				setError("")
			}, 3000);
		},
	})

	useEffect(() => {
		if (result.data) {
			const token = result.data.login.value
			setToken(token)
			localStorage.setItem("library-user-token", token)
		}
	}, [result.data, setToken])

	const submit = async (event) => {
		event.preventDefault()
		setUsername("")
		setPassword("")
		const { data } = await login({ variables: { username, password } })
		const token = data?.login?.value
		if (token) {
			setToken(token)
			localStorage.setItem("library-user-token", token)
			navigate("/")
		}
	}

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					username
					<input
						type="text"
						value={username}
						onChange={({ target }) => setUsername(target.value)}
					/>
				</div>
				<div>
					password
					<input
						type="password"
						value={password}
						onChange={({ target }) => setPassword(target.value)}
					/>
				</div>
				<button type="submit">login</button>
			</form>
		</div>
	)
}

export default LoginForm
