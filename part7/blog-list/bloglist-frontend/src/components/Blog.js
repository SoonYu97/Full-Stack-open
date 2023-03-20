import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const Blog = ({ blog }) => {
  return (
    <div className="blog" style={blogStyle}>
      <Link to={`blogs/${blog.id}`}>{blog.title}</Link>
    </div>
  )
}

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: 'solid',
  borderWidth: 1,
  marginBottom: 5,
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog
