import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

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
    <>
      <nav>
        <li><Link to="/">blogs</Link></li>
        <li><Link to="/users">users</Link></li>
      </nav>
      <span>{user.name} logged in</span>
      <button onClick={logout}>logout</button>
    </>
  )
}

export default Nav