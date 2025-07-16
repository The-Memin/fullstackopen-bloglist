const mongoose = require('mongoose')

if(process.argv.length < 3){
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://guillejuma:${password}@cluster0.lnm2x0o.mongodb.net/testBlogList?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})

const Blog = mongoose.model('Person', blogSchema)

if (process.argv.length === 3) {
    Blog.find({}).then(result => {
        console.log('Blogs:')
        result.forEach(blog => {
            console.log(`${blog.title} ${blog.author}`)
        })
      mongoose.connection.close()
    })
}else{
    const newTitle = process.argv[3]
    const newAuthor = Number(process.argv[4])

    if (typeof newTitle !== 'string') {
        console.log('Provide a valid title')
        process.exit(1)
    }
    if (isNaN(newAuthor)) {
        console.log('Provide a valid author')
        process.exit(1)
    }
    const blog = new Blog({
        title: newTitle,
        author: newAuthor
    })

    blog.save().then(result => {
        console.log(`added ${result.title} number ${result.author} to phonebook`)
        mongoose.connection.close()
    })
}