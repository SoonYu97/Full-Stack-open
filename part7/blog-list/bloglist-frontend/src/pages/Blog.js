import { useState, useEffect } from 'react'
import { useMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { voteBlog, deleteBlog, addComment } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

import { useField } from '../hooks'

import blogService from '../services/blogs'

const Blog = ({ user }) => {
  const dispatch = useDispatch()

  const [blog, setBlog] = useState(null)
  const match = useMatch('/blogs/:id')

  const comment = useField('text', 'comment-input')
  const { reset: commentReset, ...commentInput } = comment

  useEffect(() => {
    async function getOneBlog() {
      const blog = await blogService.getOne(match.params.id)
      setBlog(blog)
    }

    getOneBlog()
  }, [dispatch])

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

  if (!blog) {
    return (<><h2>loading...</h2></>)
  }

  const onAddComment = () => {
    commentReset()
    dispatch(addComment(blog.id, commentInput.value))
  }

  return (
    <>
      <h2>{blog.title}</h2>
      <div>
        <a href={blog.url}>{blog.url}</a>
      </div>
      <div>
        {blog.likes} like{blog.likes > 1 && 's'}
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
      <div>
        <h3>comments</h3>
        <div>
          <input {...commentInput} />
          <button onClick={onAddComment}>add comment</button>
        </div>
        <ul>
          {blog.comments && blog.comments.length > 0 && (
            blog.comments.map((comment) => (
              <li key={comment}>{comment}</li>
            ))
          )}
        </ul>
      </div>
    </>
  )
}

export default Blog