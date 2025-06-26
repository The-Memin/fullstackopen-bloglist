const dummy = () => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (!Array.isArray(blogs) || blogs.length === 0) return null;

  const blogWithMostLikes = blogs.reduce((prev, curr) =>
    curr.likes > prev.likes ? curr : prev
  );

  const { title, author, likes } = blogWithMostLikes;
  return { title, author, likes };
};


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}