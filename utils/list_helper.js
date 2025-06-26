const _ = require('lodash')

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


const mostBlogs = (blogs) => {
	if (blogs.length === 0) return null;

	const grouped = _.countBy(blogs, 'author');

	const topAuthor = _.maxBy(Object.keys(grouped), author => grouped[author]);

	return {
		author: topAuthor,
		blogs: grouped[topAuthor]
	};
}

const mostLikes = (blogs) => {
	 if (blogs.length === 0) return null

	const grouped = _.groupBy(blogs, 'author')

	const likesByAuthor = _.map(grouped, (blogs, author) => {
		return {
			author,
			likes: _.sumBy(blogs, 'likes')
		}
	})

	return _.maxBy(likesByAuthor, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}