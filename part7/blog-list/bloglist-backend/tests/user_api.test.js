const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')

const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')
const User = require('../models/user')

describe('when there is initially one user in db', () => {
	beforeEach(async () => {
		await User.deleteMany({})

		const passwordHash = await bcrypt.hash('sekret', 10)
		const user = new User({ username: 'root', passwordHash })

		await user.save()
	})

	test('creation succeeds with a fresh username', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'mluukkai',
			name: 'Matti Luukkainen',
			password: 'salainen',
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

		const usernames = usersAtEnd.map((u) => u.username)
		expect(usernames).toContain(newUser.username)
	})

	test('creation fails with proper statuscode and message if username already taken', async () => {
		const usersAtStart = await helper.usersInDb()

		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 'salainen',
		}

		const result = await api
			.post('/api/users')
			.send(newUser)
			.expect(400)
			.expect('Content-Type', /application\/json/)

		expect(result.body.error).toContain('expected `username` to be unique')

		const usersAtEnd = await helper.usersInDb()
		expect(usersAtEnd).toEqual(usersAtStart)
	})
})

describe('addition of a new user', () => {
	beforeEach(async () => {
		await User.deleteMany({})
	})

	test('succeeds with valid data', async () => {
		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 'salainen',
		}

		await api
			.post('/api/users')
			.send(newUser)
			.expect(201)
			.expect('Content-Type', /application\/json/)

		const response = await api.get('/api/users')

		expect(response.body).toHaveLength(1)

		const usernames = response.body.map((r) => r.username)
		expect(usernames).toContain('root')
	})

	test('fails with status code 400 if username length < 3', async () => {
		const newUser = {
			username: 'ro',
			name: 'Superuser',
			password: 'salainen',
		}
		await api.post('/api/users').send(newUser).expect(400)
	})

	test('fails with status code 400 if password length < 3', async () => {
		const newUser = {
			username: 'root',
			name: 'Superuser',
			password: 's',
		}
		await api.post('/api/users').send(newUser).expect(400)
	})
})

afterAll(async () => {
	await mongoose.connection.close()
})
