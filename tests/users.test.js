const bcrypt = require('bcrypt')
const User = require('../models/user')
const { test, describe, after, beforeEach } = require('node:test')
const app = require('../app')
const supertest = require('supertest')
const { default: mongoose } = require('mongoose')
const api = supertest(app)
const helper = require('./test_helper')
const assert = require('node:assert')

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
            username: 'The-Memin',
            name: 'Guillermo Juarez',
            password: 'mar98*'
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'root',
            name: 'Superuser',
            password: 'password*123'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('expeted `username` to be unique'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })


    test('creation fails if the username is less than 3 characters or does not start with a letter', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'no',
            name: 'name',
            password: 'password*123'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/ )

        const usersAtEnd = await helper.usersInDb()
        assert.match(result.body.error, /username.*start.*letter/i)

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation fails if the password is less than 3 characters or does match with the caractheristics', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'username',
            name: 'name',
            password: 'password'
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/ )

        const usersAtEnd = await helper.usersInDb()
        assert(result.body.error.includes('Password must be at least 3 characters long, include at least one letter, one number, and one special character'))

        assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})