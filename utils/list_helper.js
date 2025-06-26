const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
    if(blogs.length === 0) return 0
    if(blogs.length === 1) return blogs[0].likes

    let countLikes = 0
    blogs.forEach(blog => {
        countLikes += blog.likes
    });
    return countLikes
}

module.exports = {
  dummy,
  totalLikes
}