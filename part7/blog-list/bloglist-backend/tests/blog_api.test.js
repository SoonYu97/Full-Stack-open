const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')

const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

beforeEach(async () => {
	await Blog.deleteMany({})
	await User.deleteMany({})

	let passwordHash = await bcrypt.hash('sekret2', 10)
	let user = new User({ username: 'fakeroot', passwordHash })
	await user.save()

	passwordHash = await bcrypt.hash('sekret', 10)
	user = new User({ username: 'root', passwordHash })
	const userResponse = await user.save()

	const blog = new Blog({
		title: 'React patterns',
		author: 'Michael Chan',
		url: 'https://reactpatterns.com/',
		likes: 7,
		user: userResponse._id,
	})
	await blog.save()
})

describe('when there is initially some blogs saved ', () => {
	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('blogs have a unique identifier property named id', async () => {
		const blogs = await helper.blogsInDb()
		expect(blogs[0].id).toBeDefined()
		expect(blogs[0]._id).toBeUndefined()
	})
})

describe('addition of a new blog', () => {
	test('succeeds with valid data', async () => {
		const blogsAtStart = await helper.blogsInDb()

		const loginResponse = await api
			.post('/api/login')
			.send({ username: 'root', password: 'sekret' })

		const newBlog = {
			title: 'Nextjs patterns',
			author: 'Michael Chan',
			url: 'https://nextjs.org/',
			likes: 17,
		}

		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${loginResponse.body.token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const response = await api.get('/api/blogs')

		const titles = response.body.map((r) => r.title)
		expect(response.body).toHaveLength(blogsAtStart.length + 1)
		expect(titles).toContain('Nextjs patterns')
	})

	test('succeeds without likes and return 0 likes', async () => {
		const blogsAtStart = await helper.blogsInDb()

		const loginResponse = await api
			.post('/api/login')
			.send({ username: 'root', password: 'sekret' })

		const newBlog = {
			title: 'Nextjs patterns',
			author: 'Michael Chan',
			url: 'https://nextjs.org/',
		}
		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${loginResponse.body.token}`)
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const response = await api.get('/api/blogs')

		const blog = response.body.find((r) => r.title === 'Nextjs patterns')
		expect(response.body).toHaveLength(blogsAtStart.length + 1)
		expect(blog.likes).toBeDefined()
		expect(blog.likes).toBe(0)
	})

	test('fails with status code 400 if without title or url', async () => {
		const loginResponse = await api
			.post('/api/login')
			.send({ username: 'root', password: 'sekret' })

		const newBlog = {
			author: 'Michael Chan',
		}
		await api
			.post('/api/blogs')
			.set('Authorization', `Bearer ${loginResponse.body.token}`)
			.send(newBlog)
			.expect(400)
	})

	test('fails with status code 401 if without token', async () => {
		const newBlog = {
			title: 'Nextjs patterns',
			author: 'Michael Chan',
			url: 'https://nextjs.org/',
			likes: 17,
		}
		await api.post('/api/blogs').send(newBlog).expect(401)
	})
})

describe('update of a blog', () => {
	test('succeeds if id and token is valid', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0]
		blogToUpdate.likes += 20

		const loginResponse = await api
			.post('/api/login')
			.send({ username: 'root', password: 'sekret' })

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.set('Authorization', `Bearer ${loginResponse.body.token}`)
			.send(blogToUpdate)
			.expect(200)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await helper.blogsInDb()

		expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

		const titles = blogsAtEnd.map((r) => r.title)

		expect(titles).toContain(blogToUpdate.title)

		const blogAtEnd = blogsAtEnd.find((r) => r.title === blogToUpdate.title)

		expect(blogAtEnd.likes).toBe(blogToUpdate.likes)
	})

	test('fails with status code 400 if id is invalid', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0]
		blogToUpdate.likes += 20

		const loginResponse = await api
			.post('/api/login')
			.send({ username: 'root', password: 'sekret' })

		await api
			.put('/api/blogs/123')
			.set('Authorization', `Bearer ${loginResponse.body.token}`)
			.send(blogToUpdate)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await helper.blogsInDb()

		expect(blogsAtEnd).toHaveLength(blogsAtStart.length)
	})

	test('fails with status code 401 if token is invalid', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0]
		blogToUpdate.likes += 20

		const loginResponse = await api
			.post('/api/login')
			.send({ username: 'fakeroot', password: 'sekret2' })

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.set('Authorization', `Bearer ${loginResponse.body.token}`)
			.send(blogToUpdate)
			.expect(401)
			.expect('Content-Type', /application\/json/)

		const blogsAtEnd = await helper.blogsInDb()

		expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

		const titles = blogsAtEnd.map((r) => r.title)

		expect(titles).toContain(blogToUpdate.title)

		const blogAtEnd = blogsAtEnd.find((r) => r.title === blogToUpdate.title)

		expect(blogAtEnd.likes).toBe(blogToUpdate.likes - 20)
	})
})

describe('deletion of a blog', () => {
	test('succeeds with status code 204 if id and token are valid', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		const loginResponse = await api
			.post('/api/login')
			.send({ username: 'root', password: 'sekret' })

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set('Authorization', `Bearer ${loginResponse.body.token}`)
			.expect(204)

		const blogsAtEnd = await helper.blogsInDb()

		expect(blogsAtEnd).toHaveLength(blogsAtStart.length - 1)

		const titles = blogsAtEnd.map((r) => r.title)

		expect(titles).not.toContain(blogToDelete.title)
	})

	test('fails with status code 401 if id and token does not match is valid', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		const loginResponse = await api
			.post('/api/login')
			.send({ username: 'fakeroot', password: 'sekret2' })

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.set('Authorization', `Bearer ${loginResponse.body.token}`)
			.expect(401)

		const blogsAtEnd = await helper.blogsInDb()

		expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

		const titles = blogsAtEnd.map((r) => r.title)

		expect(titles).toContain(blogToDelete.title)
	})

	test('fails with status code 401 if no token provided', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		await api.delete(`/api/blogs/${blogToDelete.id}`).expect(401)

		const blogsAtEnd = await helper.blogsInDb()

		expect(blogsAtEnd).toHaveLength(blogsAtStart.length)

		const titles = blogsAtEnd.map((r) => r.title)

		expect(titles).toContain(blogToDelete.title)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})
