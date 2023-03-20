import { useState, useEffect } from 'react'
import { useMatch } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

import { voteBlog, deleteBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

import blogService from '../services/blogs'
import Comment from '../components/Comment'

const Blog = ({ user }) => {
  const dispatch = useDispatch()

  const [blog, setBlog] = useState(null)
  const match = useMatch('/blogs/:id')

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

  return (
    <>
      <Typography component='h3' variant="h6" gutterBottom>
        {blog.title} <Typography component='span' variant="caption" gutterBottom> by {blog.user.name}</Typography>
      </Typography>
      <Divider />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'start',
        }}
      >
        <Link underline='hover' href={blog.url}>{blog.url}</Link>
        {blog.likes} like{blog.likes > 1 && 's'}
        <Button name="like" id="like-button" onClick={updateLike}>
          like
        </Button>
      </Box>
      {user.name === blog.user.name && (
        <div>
          <Button variant='outlined' name="delete" id="delete-button" onClick={deleteB}>
            delete
          </Button>
        </div>
      )}
      <Comment blog={blog} />
    </>
  )
}

export default Blog