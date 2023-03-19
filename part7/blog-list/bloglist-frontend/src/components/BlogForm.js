import { useDispatch } from 'react-redux'

import { createBlog } from '../reducers/blogReducer'
import { setNotification } from '../reducers/notificationReducer'

import { useField } from '../hooks/UseField'

const BlogForm = () => {
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
  }

  return (
    <div className='blogFormDiv'>
      <h2>create a new blog</h2>
      <form onSubmit={addBlog}>
        <div>
          <label>
            title:
            <input required {...titleInput}/>
          </label>
        </div>
        <div>
          <label>
            author:
            <input required {...authorInput}/>
          </label>
        </div>
        <div>
          <label>
            url:
            <input required {...urlInput}/>
          </label>
        </div>
        <button id='blog-submit-button' type='submit'>create</button>
      </form>
    </div>
  )
}

export default BlogForm
