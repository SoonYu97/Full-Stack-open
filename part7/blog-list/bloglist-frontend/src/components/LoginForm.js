import { useDispatch } from 'react-redux'

import { setNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'

import { useField } from '../hooks/UseField'

import loginService from '../services/login'
import blogService from '../services/blogs'

const LoginForm = () => {
  const dispatch = useDispatch()

  const username = useField('text', 'username-input')
  const password = useField('password', 'password-input')

  const { reset: usernameReset, ...usernameInput } = username
  const { reset: passwordReset, ...passwordInput } = password

  const reset = () => {
    usernameReset()
    passwordReset()
  }

  const login = async (e) => {
    e.preventDefault()

    try {
      const user = await loginService.login({
        username: usernameInput.value,
        password: passwordInput.value,
      })

      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      blogService.setToken(user.token)
      dispatch(setUser(user))
      reset()
    } catch (exception) {
      dispatch(
        setNotification({ type: 'error', body: exception.response.data.error })
      )
      reset()
    }
  }

  return (
    <>
      <h2>log in to application</h2>
      <form onSubmit={login}>
        <div>
          <label>
            username:
            <input required {...usernameInput} />
          </label>
        </div>
        <div>
          <label>
            password:
            <input required {...passwordInput} />
          </label>
        </div>
        <div>
          <button id='login-button' type='submit'>login</button>
        </div>
      </form>
    </>
  )
}

export default LoginForm
