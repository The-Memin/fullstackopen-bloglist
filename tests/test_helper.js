const Blog = require('../models/blog')

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

module.exports = {
    initialBlogs, blogsInDb
}