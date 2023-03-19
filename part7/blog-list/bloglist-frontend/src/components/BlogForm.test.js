import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')
  const sendButton = screen.getByText('create')

  await user.type(titleInput, 'testing a form...')
  await user.type(authorInput, 'author')
  await user.type(urlInput, 'url')
  await user.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a form...')
  expect(createBlog.mock.calls[0][0].author).toBe('author')
  expect(createBlog.mock.calls[0][0].url).toBe('url')
})