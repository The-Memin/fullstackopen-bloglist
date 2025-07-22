const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: v => /^[a-zA-Z][a-zA-Z0-9_-]{2,}$/.test(v),
            message: props => `${props.value} is not a valid username`
        }
    },
    name: {
        type: String,
        require: true
    },
    passwordHash: {
        type: String,
        require: true
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnObject) => {
        returnObject.id = returnObject._id.toString()
        delete returnObject._id
        delete returnObject.__v
        //the passwordHash should not be displayed
        delete returnObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User