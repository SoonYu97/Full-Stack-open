import { Link } from 'react-router-dom'

import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'

import PropTypes from 'prop-types'

const Blog = ({ blog }) => {
  return (
    <Grid item xs={12} md={6}>
      <CardActionArea component={Link} to={`blogs/${blog.id}`}>
        <Card sx={{ display: 'flex' }}>
          <CardContent sx={{ flex: 1 }}>
            <Typography component="h2" variant="h5">
              {blog.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {blog.author}
            </Typography>
            <Typography variant="subtitle1" color="primary">
              Continue reading...
            </Typography>
          </CardContent>
        </Card>
      </CardActionArea>
    </Grid>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
}

export default Blog
