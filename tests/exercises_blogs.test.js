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

test('notes are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/ )
})

test('verify that the blog posts unique identifier property is called id', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    assert.ok(blog.id)
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

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

    assert(titles.includes("async/await simplifies making async calls"))
})

test('If the likes property is missing in the request, it will default to 0', async () => {
    const newBlog = {
        'title': 'New Blog',
        "author": 'author2',
        "url": "www.author2.com"
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/blogs')

    const addedBlog = response.body.find(blog => blog.title === "New Blog")

    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)
    assert.strictEqual(addedBlog.likes, 0)
})

after(async () => {
    await mongoose.connection.close()
})