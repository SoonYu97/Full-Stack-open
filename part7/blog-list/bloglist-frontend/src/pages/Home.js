import { useState } from 'react'
import { useSelector } from 'react-redux'

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'

import Blog from '../components/Blog'
import BlogForm from '../components/BlogForm'

const Home = ({ user }) => {
  const [open, setOpen] = useState(false)

  const blogs = useSelector(state => state.blogs)

  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={{ mb: 4 }}
      >
        Open form dialog
      </Button>
      <BlogForm open={open} setOpen={setOpen} />
      <Grid container spacing={4}>
        {blogs.map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            user={user}
          />
        ))}
      </Grid>
    </>
  )
}

export default Home