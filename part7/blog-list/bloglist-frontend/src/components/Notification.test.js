import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Notification from './Notification'

test('renders content with message', () => {
  const message = {
    body: 'success message',
    type: 'success'
  }

  const { container } = render(<Notification message={message} />)
  const successNotification = container.querySelector('.success')
  expect(successNotification).toBeDefined()
  expect(successNotification.innerHTML).toEqual(message.body)
})

test('renders nothing without message', () => {
  const message = null

  const { container } = render(<Notification message={message} />)
  const successNotification = container.querySelector('.success')
  expect(successNotification).toBeNull()
})