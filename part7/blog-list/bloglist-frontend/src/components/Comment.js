import { useDispatch } from 'react-redux'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

import { addComment } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

import { useField } from '../hooks'

const Comment = ({ blog }) => {
  const dispatch = useDispatch()

  const comment = useField('text', 'comment-input')
  const { reset: commentReset, ...commentInput } = comment

  const onAddComment = () => {
    if (commentInput.value !== '') {
      commentReset()
      dispatch(addComment(blog.id, commentInput.value))
      dispatch(setNotification('Comment added succesfully'))
    }
  }

  return (
    <Box
      component='section'
      sx={{
        width: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'start',
        alignItems: 'start'
      }}
    >
      <Typography component='h3' variant='h6'>comments</Typography>
      <Box
        sx={{
          width: 1,
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <TextField
          required
          label='comment'
          {...commentInput}
        />
        <Button variant='contained' onClick={onAddComment}>add comment</Button>
      </Box>
      <ul>
        {blog.comments && blog.comments.length > 0 && (
          blog.comments.map((comment) => (
            <li key={comment}>{comment}</li>
          ))
        )}
      </ul>
    </Box>
  )
}

export default Comment