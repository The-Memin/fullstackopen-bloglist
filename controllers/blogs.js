const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const mongoose = require('mongoose')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes
  })

  try{
    const savedBlog = await blog.save()
    response.status(201).json(savedBlog)
  }
  catch(exception){
    next(exception)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const { id } = request.params

    // Verificar si el ID es válido antes de hacer la consulta
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return response.status(400).json({ error: 'invalid ID' })
    }

    const result = await Blog.findByIdAndDelete(id)

    if (!result) {
      return response.status(404).json({ error: 'Blog no found' })
    }
    response.status(204).send(result)
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter