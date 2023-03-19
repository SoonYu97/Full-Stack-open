const jwt = require('jsonwebtoken')

const logger = require('./logger')
const User = require('../models/user')

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, req, res, next) => {
	logger.error(error.name, error.message)

	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	} else if (error.name === 'JsonWebTokenError') {
		return res.status(401).json({ error: error.message })
	}

	next(error)
}

const tokenExtractor = (request, response, next) => {
	const authorization = request.get('authorization')
	if (authorization && authorization.startsWith('Bearer ')) {
		request.token = authorization.replace('Bearer ', '')
	} else {
		request.token = null
	}
	
	next()
}

const userExtractor = async (request, response, next) => {
	const decodedToken = jwt.verify(request.token, process.env.SECRET)
	if (!decodedToken.id) {
		return response.status(401).json({ error: 'token invalid' })
	}
	request.user = await User.findById(decodedToken.id)
	
	next()
}

module.exports = { unknownEndpoint, errorHandler, tokenExtractor, userExtractor }
