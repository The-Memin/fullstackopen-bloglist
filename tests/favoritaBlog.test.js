const { test, describe } = require('node:test')
const assert = require('node:assert')
const favoriteBlog = require('../utils/list_helper').favoriteBlog
const { listWithOneBlog, blogs, maxLikesBlog, maxLikesBlogSingle } = require('../constants/blogs')

describe('favoriteBlog', () => {
    test('returns null for an empty list', () => {
        const result = favoriteBlog([])
        assert.strictEqual(result, null)
    })

    test('returns the blog itself when list has only one blog', () => {
        const result = favoriteBlog(listWithOneBlog)
        assert.deepStrictEqual(result, maxLikesBlogSingle)
    })

    test('returns the blog with the most likes from a larger list', () => {
        const result = favoriteBlog(blogs)
        assert.deepStrictEqual(result, maxLikesBlog)
     })
})