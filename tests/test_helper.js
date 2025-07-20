const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        "title": "Blog 1",
        "author": "Guillermo",
        "url": "www.blog.com.mx",
        "likes": 250
    },
    {
        "title": "Blog 2",
        "author": "Desiré",
        "url": "www.blogMyLove.com.mx",
        "likes": 300
    }
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await  User.find({})
    return users.map( u => u.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url:'www.test.com', author: 'author', likes: 0 })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

module.exports = {
    initialBlogs, blogsInDb, usersInDb, nonExistingId
}