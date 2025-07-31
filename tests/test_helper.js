const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')

const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const initialUsers = [
    {
        name: 'Guillermo',
        username: 'The-Memin',
        password: 'sekret123*'
    },
    {
        name: 'Desiré',
        username: 'MyLove',
        password: 'beauty123*'
    }
]

const initialBlogs = [
    {
        "title": "Blog 1",
        "url": "www.blog.com.mx",
        "likes": 250,
    },
    {
        "title": "Blog 2",
        "url": "www.blogMyLove.com.mx",
        "likes": 300
    }
]

const resetUsersAndBlogs = async () => {
  await User.deleteMany({})
  await Blog.deleteMany({})

  const users = await Promise.all(
    initialUsers.map( async (user) => {
      const { password, ...rest } = user
      const passwordHash = await bcrypt.hash(password, 10)
      return await new User({ ...rest, passwordHash }).save()
    })
  )

  const blogsPromises = initialBlogs.map( async (blog, index) => {
    const { title, url, likes } = blog
    const user = users[index%users.length]

    const savedBlog = await new Blog({ title, author: user.name, url, likes, user: user._id }).save()

    await User.updateOne(
      { _id: user._id },
      { $push: { blogs: savedBlog._id } }
    )
  })

  await Promise.all(blogsPromises)
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon', url:'www.test.com', author: 'author', likes: 0 })
  await blog.save()
  await blog.deleteOne()

  return blog._id.toString()
}

const getAuthToken = async () => {
    const response = await api
                    .post('/api/login/')
                    .send({ username: initialUsers[0].username, password: initialUsers[0].password })
    const user = await User.findOne({ username: initialUsers[0].username })
    return {
      token: response.body.token,
      testUser: user.toJSON()
    }
}

module.exports = {
    initialBlogs,
    initialUsers,
    blogsInDb,
    usersInDb,
    nonExistingId,
    resetUsersAndBlogs,
    getAuthToken
}