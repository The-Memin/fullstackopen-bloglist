const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log("connect to database")
    })
    .catch(error => console.error(error))

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogsRouter)

module.exports = app