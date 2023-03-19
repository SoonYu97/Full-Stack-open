import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog\'s title and author without url and likes', () => {
  let element
  const blog = {
    title: 'Component testing',
    author: 'SuperUser',
    url: 'https://www.example.com',
    likes: 2
  }

  render(<Blog blog={blog} />)
  element = screen.getByText('Component testing', { exact: false })
  expect(element).toBeDefined()
  expect(element.innerHTML).toContain('Component testing')
  expect(element.innerHTML).toContain('SuperUser')

  element = screen.queryByText('https://www.example.com')
  expect(element).toBeNull()
})

test('renders blog\'s url and likes after button clicked', async () => {
  const loginUser = {
    id: 1,
    name: 'SuperUser',
    username: 'root'
  }
  const blog = {
    title: 'Component testing',
    author: 'SuperUser',
    url: 'https://www.example.com',
    likes: 0,
    user: loginUser
  }


  render(
    <Blog blog={blog} user={loginUser} />
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const element = screen.getByText('https://www.example.com')
  expect(element).toBeDefined()
})

test('update likes', async () => {
  const loginUser = {
    id: 1,
    name: 'SuperUser',
    username: 'root'
  }
  const blog = {
    title: 'Component testing',
    author: 'SuperUser',
    url: 'https://www.example.com',
    likes: 0,
    user: loginUser
  }

  const mockHandler = jest.fn()

  const { container } = render(
    <Blog blog={blog} user={loginUser} updateBlog={mockHandler}/>
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  expect(screen.getByText('like 0', { exact: false })).toBeDefined()

  const likeButton = container.querySelector('#like-button')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})

test('delete blog', async () => {
  const loginUser = {
    id: 1,
    name: 'SuperUser',
    username: 'root'
  }
  const blog = {
    title: 'Component testing',
    author: 'SuperUser',
    url: 'https://www.example.com',
    likes: 0,
    user: loginUser
  }

  const mockHandler = jest.fn()
  window.confirm = jest.fn(() => true)

  const { container } = render(
    <Blog blog={blog} user={loginUser} deleteBlog={mockHandler}/>
  )

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)
  expect(screen.getByText('delete')).toBeDefined()

  const deleteButton = container.querySelector('#delete-button')
  await user.click(deleteButton)
  expect(window.confirm).toBeCalled()
  expect(mockHandler.mock.calls).toHaveLength(1)
})