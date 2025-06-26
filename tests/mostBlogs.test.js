const { test, describe } = require('node:test')
const assert = require('node:assert')
const mostBlogs = require('../utils/list_helper').mostBlogs
const { blogs } = require('../constants/blogs')

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