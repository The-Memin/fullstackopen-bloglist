const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
    const { username, name, password } = request.body

    const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_-]{2,}$/
    if(!usernameRegex.test(username)){
        return response.status(400).json({
            error: 'Username must start with a letter, be at least 3 characters long, and contain only letters and numbers'
        })
    }

    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{3,}$/
    if (!passwordRegex.test(password)) {
        return response.status(400).json({
        error: 'Password must be at least 3 characters long, include at least one letter, one number, and one special character'
        })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

usersRouter.get('/', async (request, response) => {
    const users = await User.find({}).populate('blogs')
    response.json(users)
})

module.exports = usersRouter