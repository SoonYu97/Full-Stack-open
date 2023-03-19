import { useState, useEffect } from 'react'
import { useMatch } from 'react-router-dom'

import userService from '../services/users'

const User = () => {
  const [user, setUser] = useState(null)
  const match = useMatch('/users/:id')

  useEffect(() => {
    async function getOneUser() {
      const user = await userService.getOne(match.params.id)
      setUser(user)
    }

    getOneUser()
  }, [])

  if (!user) {
    return (<><h2>loading...</h2></>)
  }

  return (
    <>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </>
  )
}

export default User