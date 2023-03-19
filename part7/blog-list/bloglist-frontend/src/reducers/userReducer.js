import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    addUser(_, action) {
      return action.payload
    },
    clearUser() {
      return null
    }
  }
})

export const { addUser, clearUser } = userSlice.actions

export const setUser = (message) => {
  return async dispatch => {
    dispatch(addUser(message))
  }
}

export const removeUser = () => {
  return async dispatch => {
    dispatch(clearUser())
  }
}

export default userSlice.reducer