import { useDispatch } from 'react-redux'

import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'

import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

import { useField } from '../hooks/index'

const BlogForm = ({ open, setOpen }) => {
  const dispatch = useDispatch()

  const title = useField('text', 'title-input')
  const author = useField('text', 'author-input')
  const url = useField('text', 'url-input')

  const { reset: titleReset, ...titleInput } = title
  const { reset: authorReset, ...authorInput } = author
  const { reset: urlReset, ...urlInput } = url

  const reset = () => {
    titleReset()
    authorReset()
    urlReset()
  }

  const addBlog = (event) => {
    event.preventDefault()
    dispatch(
      createBlog({
        title: titleInput.value,
        author: authorInput.value,
        url: urlInput.value,
      }))

    reset()

    dispatch(setNotification({
      type: 'success',
      body: `a new blog ${titleInput.value} by ${authorInput.value} added`,
    }, 5))
    setOpen(false)
  }

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Create a new blog</DialogTitle>
      <DialogContent>
        <TextField
          required
          fullWidth
          margin='normal'
          label='Title'
          {...titleInput}
        />
        <TextField
          required
          fullWidth
          margin='normal'
          label='Author'
          {...authorInput}
        />
        <TextField
          required
          fullWidth
          margin='normal'
          label='URL'
          {...urlInput}
        />
      </DialogContent>
      <DialogActions>
        <Button
          id='login-button'
          type='submit'
          fullWidth
          variant='contained'
          onClick={addBlog}
          sx={{ mt: 3, mb: 2 }}
        >
          create
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default BlogForm
