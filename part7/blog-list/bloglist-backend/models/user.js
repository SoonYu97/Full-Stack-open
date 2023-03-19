const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true,
		minLength: [3, 'must be longer than 3 characters'],
	},
	name: String,
	passwordHash: String,
	blogs: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Blog',
		},
	],
})

userSchema.plugin(uniqueValidator)

userSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
		delete returnedObject.passwordHash
	},
})

module.exports = mongoose.model('User', userSchema)
