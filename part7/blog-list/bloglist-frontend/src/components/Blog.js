import { useState } from 'react'
import { useDispatch } from 'react-redux'

import { voteBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

import PropTypes from 'prop-types'

const Blog = ({ blog, user }) => {
  const dispatch = useDispatch()

  const [showMore, setShowMore] = useState(false)

  const updateLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id,
    }
    dispatch(voteBlog(updatedBlog))
    dispatch(setNotification({
      type: 'success',
      body: `a blog ${blog.title} by ${blog.author} is updated`,
    }, 5))
  }

  const deleteB = () => {
    if (window.confirm(`Removing blog ${blog.title} by ${blog.author}`)) {
      dispatch(deleteBlog(blog.id))
      dispatch(setNotification({
        type: 'success',
        body: `a blog ${blog.title} by ${blog.author} is deleted`,
      }, 5))
    }
  }
  return (
    <div className="blog" style={blogStyle}>
      {blog.title} {blog.author}{' '}
      <button name="more" onClick={() => setShowMore(!showMore)}>
        {showMore ? 'hide' : 'view'}
      </button>
      {showMore && (
        <div>
          <div>
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
						like{blog.likes > 1 && 's'} {blog.likes}{' '}
            <button name="like" id="like-button" onClick={updateLike}>
							like
            </button>
          </div>
          <div>{blog.user.name}</div>
          {user.name === blog.user.name && (
            <div>
              <button name="delete" id="delete-button" onClick={deleteB}>
								delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog
