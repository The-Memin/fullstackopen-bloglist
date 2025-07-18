const { test, describe, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')

const api = supertest(app)
const helper = require('./test_helper')

const nonExistingId = new mongoose.Types.ObjectId().toString()

beforeEach( async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})
describe('GET /api/blogs', () => {
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
})

describe('POST /api/blogs', () => {
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

    test('fails with 400 if it has no title', async () => {
        const newBlog = {
            "author": 'Guillermo',
            "url": "www.example.com"
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert.ok(response.body.error, 'There should be an error message')
        assert.match(response.body.error, /title.*required/i)

    })

    test('fails with 400 if it has no url', async () => {
        const newBlog = {
            "title": "Blog without URL",
            "author": 'Guillermo',
        }

        const response = await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert.ok(response.body.error, 'There should be an error message')
        assert.match(response.body.error, /url.*required/i)

    })
})

describe('DELETE /api/blogs', () => {
    test('Detele blog by id', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()

        const titles = blogsAtEnd.map(r => r.title)
        assert(!titles.includes(blogToDelete.title))

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
    })

    test('Returns 400 Bad Request when deleting a blog with invalid ID', async () => {
        const response = await api
            .delete(`/api/blogs/invalidID`)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()

        assert.ok(response.body.error, 'There should be an error message')
        assert.match(response.body.error, /invalid ID/)
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('Returns 404 Not Found when deleting a blog with a valid but non-existent ID', async () => {

        const response = await api
            .delete(`/api/blogs/${nonExistingId}`)
            .expect(404)
            .expect('Content-Type', /application\/json/)

        assert.ok(response.body.error, 'There should be an error message')
        assert.match(response.body.error, /no found/i)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

})

describe('PUT /api/blogs', () => {
    test('successfully updates likes of a blog post', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedBlog = {
            'likes': blogToUpdate.likes + 1
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedBlog)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)
        assert.strictEqual(response.body.title, blogToUpdate.title)
        assert.strictEqual(response.body.url, blogToUpdate.url)
        assert.strictEqual(response.body.author, blogToUpdate.author)

        const updated = await Blog.findById(blogToUpdate.id)
        assert.strictEqual(updated.likes, blogToUpdate.likes + 1)
    })

    test('fails with status 400 if ID is invalid', async () => {
        const invalidId = '123invalidid'
        await api
            .put(`/api/blogs/${invalidId}`)
            .send({ likes: 10 })
            .expect(400)
    })

    test('returns 404 if blog does not exist', async () => {

        const updatedBlog = {
            title: 'Nonexistent Blog',
            author: 'Ghost Author',
            url: 'http://ghost.url',
            likes: 0
        }

        await api
            .put(`/api/blogs/${nonExistingId}`)
            .send(updatedBlog)
            .expect(404) // o 204 si decides que no hay contenido
    })
})

after(async () => {
    await mongoose.connection.close()
})