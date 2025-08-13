const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')
const { userExtractor } = require('../utils/middleware')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', userExtractor, async (request, response, next) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = request.user

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user.id
  })

  try{
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  }
  catch(exception){
    console.log(exception.name)
    next(exception)
  }
})

blogsRouter.delete('/:id',userExtractor, async (request, response, next) => {
  const { id } = request.params

  const user = request.user
  try {
    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    if (blog.user.toString() !== user.id.toString()) {
      return response.status(403).json({ error: 'You do not have permission to delete this blog' })
    }

    await Blog.findByIdAndDelete(id)
    response.status(204).end()

  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const { id } = request.params
  const { title, author, url, likes } = request.body

  if (!request.token) {
    return response.status(401).json({ error: 'Token missing' })
  }

  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if(!decodedToken.id) {
      return response.status(401).json({ error: 'Token invalid' })
    }

    const blog = await Blog.findById(id)
    if (!blog) {
      return response.status(404).json({ error: 'Blog not found' })
    }

    if (blog.user.toString() !== decodedToken.id.toString()) {
      return response.status(403).json({ error: 'You do not have permission to update this blog' })
    }

    const updatedBlog = await Blog.findByIdAndUpdate( id, { title, author, url, likes }, {
      new: true,
      runValidators: true,
      context: 'query'
    })

    if (!updatedBlog) {
      return response.status(404).json({ error: 'Blog not found' })
    }
    response.status(200).json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter