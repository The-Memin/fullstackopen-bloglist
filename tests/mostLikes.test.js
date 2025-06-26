const assert = require('node:assert')
const { test, describe } = require('node:test')
const mostLikes =  require('../utils/list_helper').mostLikes

const emptyList = []

const listWithOneBlog = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    likes: 7
  }
]

const listWithManyBlogs = [
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    likes: 5
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    likes: 12
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    likes: 10
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    likes: 0
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    likes: 2
  }
]

describe('most likes', () => {
  test('returns null for an empty list', () => {
    const result = mostLikes(emptyList)
    assert.strictEqual(result, null)
  })

  test('returns the only author and likes if list has one blog', () => {
    const result = mostLikes(listWithOneBlog)
    assert.deepStrictEqual(result, {
      author: 'Michael Chan',
      likes: 7
    })
  })

  test('returns the author with the highest total likes from multiple blogs', () => {
    const result = mostLikes(listWithManyBlogs)
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17
    })
  })
})
