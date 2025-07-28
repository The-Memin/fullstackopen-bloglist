const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user')
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body
  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if(!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  const user = await User.findById(decodedToken.id)

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
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  const { id } = request.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'invalid ID' })
  }
  try {

    const result = await Blog.findByIdAndDelete(id)

    if (!result) {
      return response.status(404).json({ error: 'Blog no found' })
    }
    response.status(204).send(result)
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {

  const { id } = request.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ error: 'invalid ID' })
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate( id, request.body, {
      new: true,
      runValidators: true,
      context: 'query'
    })

    if (!updatedBlog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    response.status(200).json(updatedBlog)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter