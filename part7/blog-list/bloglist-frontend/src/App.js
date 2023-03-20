import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'


import { initializeBlog } from './reducers/blogReducer'
import { setUser } from './reducers/userReducer'

import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

import blogService from './services/blogs'

import Home from './pages/Home'
import Users from './pages/Users'
import User from './pages/User'
import Blog from './pages/Blog'
import Nav from './pages/Nav'

const App = () => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.user)

  useEffect(() => {
    async function fetchBlogs() {
      dispatch(initializeBlog())
    }
    fetchBlogs()
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  return (
    <div>
      <Notification />
      {!user ? (
        <Togglable buttonLabel="login">
          <LoginForm />
        </Togglable>
      ) : (
        <>
          <Nav />
          <h1 style={{ textTransform: 'uppercase' }}>blog app</h1>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/blogs/:id" element={<Blog user={user} />} />
            {/*
            <Route path="/create" element={<CreateNew addNew={addNew} />} />
            <Route path="/about" element={<About />} /> */}
          </Routes>
        </>
      )}
    </div>
  )
}

export default App
