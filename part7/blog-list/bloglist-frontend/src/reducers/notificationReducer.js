import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    addNotification(_, action) {
      return action.payload
    },
    removeNotification() {
      return ''
    }
  }
})

export const { addNotification, removeNotification } = notificationSlice.actions


export const setNotification = (message, timeout = 3) => {
  return async dispatch => {
    dispatch(addNotification(message))
    setTimeout(() => {
      dispatch(removeNotification())
    }, timeout * 1000)
  }
}

export default notificationSlice.reducer