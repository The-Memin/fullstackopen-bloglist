const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')

const api = supertest(app)
const helper = require('./test_helper')

beforeEach( async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('verify that the blog posts unique identifier property is called id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert.ok(blog.id)
})

after(async () => {
    await mongoose.connection.close()
})