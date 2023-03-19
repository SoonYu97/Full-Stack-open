import { useRef } from 'react'
import { useSelector } from 'react-redux'

import Blog from '../components/Blog'
import BlogForm from '../components/BlogForm'
import Togglable from '../components/Togglable'

const Home = ({ user }) => {
  const blogFormRef = useRef()

  const blogs = useSelector(state => state.blogs)

  return (
    <>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <BlogForm />
      </Togglable>
      <div>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
          />
        ))}
      </div>
    </>
  )
}

export default Home