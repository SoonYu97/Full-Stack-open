import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import userService from '../services/users'

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    async function getAllUsers() {
      const users = await userService.getAll()
      setUsers(users)
    }

    getAllUsers()
  }, [])

  return (
    <>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}

export default Users