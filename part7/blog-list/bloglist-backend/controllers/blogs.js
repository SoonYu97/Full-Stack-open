const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
	response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
	const user = request.user
	if (!user) {
		return response.status(401).json({ error: 'operation not permitted' })
	}

	const { title, author, url, likes } = request.body
	const blog = new Blog({
		title,
		author,
		url,
		likes: likes ? likes : 0,
	})
	blog.user = user._id

	const createdBlog = await blog.save()

	user.blogs = user.blogs.concat(createdBlog._id)
	await user.save()

	response.status(201).json({
		...createdBlog.toObject(),
		id: createdBlog._id,
		user: { id: user.id, name: user.name, username: user.username },
	})
})

blogsRouter.put('/:id', async (request, response) => {
	await Blog.findByIdAndUpdate(request.params.id)
	const updatedBlog = await Blog.findByIdAndUpdate(
		request.params.id,
		request.body,
		{ new: true }
	)
	if (updatedBlog?.user) {
		const user = await User.findById(
			updatedBlog.user,
			'id name username'
		).lean()
		return response.json({
			...updatedBlog.toObject(),
			id: updatedBlog._id,
			user,
		})
	}
	return response.json(updatedBlog)
})

blogsRouter.delete(
	'/:id',
	middleware.userExtractor,
	async (request, response) => {
		const user = request.user

		const blog = await Blog.findById(request.params.id)

		if (blog.user.toString() === user.id.toString()) {
			await Blog.findByIdAndRemove(request.params.id)
		} else {
			return response.status(401).json({
				error: 'invalid username or password',
			})
		}
		response.status(204).end()
	}
)

module.exports = blogsRouter
