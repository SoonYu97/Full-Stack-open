import { createSlice } from '@reduxjs/toolkit'

import blogService from '../services/blogs'

const compareLike = (a, b) => b.likes - a.likes

const blogSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    appendBlog(state, action) {
      return state.concat(action.payload).sort(compareLike)
    },
    removeBlog(state, action) {
      return state.filter((blog) => blog.id !== action.payload).sort(compareLike)
    },
    updateBlog(state, action) {
      return state.map((s) => s.id !== action.payload.id ? s : action.payload).sort(compareLike)
    },
    setBlogs(_, action) {
      return action.payload.sort(compareLike)
    }
  },
})

export const { updateBlog, appendBlog, removeBlog, setBlogs } = blogSlice.actions

export const initializeBlog = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (newBlog) => {
  return async dispatch => {
    const blog = await blogService.addBlog(newBlog)
    dispatch(appendBlog(blog))
  }
}

export const deleteBlog = (blogId) => {
  return async dispatch => {
    await blogService.deleteBlog(blogId)
    dispatch(removeBlog(blogId))
  }
}

export const voteBlog = (updatedBlog) => {
  return async dispatch => {
    const blog = await blogService.updateBlog(updatedBlog)
    dispatch(updateBlog(blog))
    return blog
  }
}

export default blogSlice.reducer