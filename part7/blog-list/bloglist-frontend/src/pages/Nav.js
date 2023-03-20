import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import UILink from '@mui/material/Link'
import Button from '@mui/material/Button'
import GlobalStyles from '@mui/material/GlobalStyles'

import { removeUser } from '../reducers/userReducer'

const Nav = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  const logout = async (e) => {
    e.preventDefault()

    window.localStorage.removeItem('loggedBlogappUser')
    dispatch(removeUser())
  }

  if (!user)
    return (<></>)

  return (
    <header>
      <GlobalStyles styles={{ ul: { margin: 0, padding: 0, listStyle: 'none' } }} />
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            {user.name} logged in
          </Typography>
          <nav>
            <UILink
              component={Link}
              variant="button"
              color="text.primary"
              underline="hover"
              to='/'
              sx={{ my: 1, mx: 1.5 }}
            >
              Blogs
            </UILink>
            <UILink
              component={Link}
              variant="button"
              color="text.primary"
              underline="hover"
              to='/users'
              sx={{ my: 1, mx: 1.5 }}
            >
              Users
            </UILink>
          </nav>
          <Button
            variant="outlined"
            sx={{ my: 1, mx: 1.5 }}
            onClick={logout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </header>
  )
}

export default Nav