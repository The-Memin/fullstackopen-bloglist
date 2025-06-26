const { test, describe } = require('node:test')
const assert = require('node:assert')
const { totalLikes, favoriteBlog, mostBlogs } = require('../utils/list_helper')
const { listWithOneBlog, blogs, maxLikesBlog, maxLikesBlogSingle } = require('../constants/blogs')

describe('total likes', () => {
    test('of empty list is zero', () => {
        const result = totalLikes([])
        assert.strictEqual(result, 0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        const result = totalLikes(listWithOneBlog)
        assert.strictEqual(result, listWithOneBlog[0].likes)
    })

    test('of a bigger list is calculated right',() => {
        const result = totalLikes(blogs)
        assert.strictEqual(result, 36)
    })
})

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

describe('mostBlogs', () => {
  test('returns null when list is empty', () => {
    const result = mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('returns correct author when list has only one blog', () => {
    const oneBlog = [
      {
        title: 'A blog',
        author: 'Ana',
        likes: 5
      }
    ]
    const result = mostBlogs(oneBlog)
    assert.deepStrictEqual(result, {
      author: 'Ana',
      blogs: 1
    })
  })

  test('returns author with most blogs from a bigger list', () => {
    const result = mostBlogs(blogs)
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})