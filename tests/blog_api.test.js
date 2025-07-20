const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')

const { initialBlogs } = require('./test_helper')

const api = supertest(app)

beforeEach( async () => {
    await Blog.deleteMany({})

    const blogObjects = initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/ )
})

test('there are two blogs', async () => {
    console.log(process.env.NODE_ENV)
    const response = await api.get('/api/blogs')
    assert.strictEqual(response.body.length, initialBlogs.length)
})

test('a valid blog can be added', async () => {
    const newBlog = {
        "title": "async/await simplifies making async calls",
        "author": "Yo",
        "url": "www.yoyo.com.mx",
        "likes": 3023
    }

    await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const titles = response.body.map(r => r.title)

    assert.strictEqual(response.body.length, initialBlogs.length + 1)

    assert(titles.includes("async/await simplifies making async calls"))
})

after(async () => {
    await mongoose.connection.close()
})