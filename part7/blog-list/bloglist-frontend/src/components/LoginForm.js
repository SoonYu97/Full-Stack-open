import { useDispatch } from 'react-redux'

import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

import { setNotification } from '../reducers/notificationReducer'
import { setUser } from '../reducers/userReducer'

import { useField } from '../hooks/index'

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Typography component='h1' variant='h5'>
        log in to application
      </Typography>
      <Box component='form' onSubmit={login} noValidate sx={{ mt: 2, maxWidth: '300px' }}>
        <TextField
          required
          fullWidth
          margin='normal'
          label='Username'
          {...usernameInput}
        />
        <TextField
          required
          fullWidth
          margin='normal'
          label='Password'
          {...passwordInput}
        />
        <Button
          id='login-button'
          type='submit'
          fullWidth
          variant='contained'
          sx={{ mt: 3, mb: 2 }}
        >
          login
        </Button>
      </Box>
    </Box>
  )
}

export default LoginForm
