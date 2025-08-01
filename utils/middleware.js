const User = require('../models/user')
const jwt = require('jsonwebtoken')
const logger = require('./logger')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    logger.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({ error: 'malformatted id' })
    }
    else if(error.name === 'ValidationError'){
        return response.status(400).send({ error: error.message })
    }
    else if(error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')){
        return response.status(400).json({ error: 'expeted `username` to be unique' })
    }
    else if(error.name === 'JsonWebTokenError'){
        return response.status(401).json({ error: 'token invalid' })
    }
    else if(error.name === 'TokenExpiredError'){
        return response.status(401).json({ error: 'token expired' })
    }

    next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.startsWith('Bearer ')) {
    const token = authorization.replace('Bearer ', '')
    request.token = token
  }else{
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Token invalid' })
    }

    const user = await User.findById(decodedToken.id)

    if (!user) {
      return response.status(401).json({ error: 'User not found' })
    }

    request.user = user
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = {
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
}