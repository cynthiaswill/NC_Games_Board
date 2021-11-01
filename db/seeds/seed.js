const db = require('../connection.js');
const format = require('pg-format');

const seed = async (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS reviews;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS categories;`);
   // 1. create tables
  const createCategories = () => {
    db.query(`CREATE TABLE categories (
      slug VARCHAR PRIMARY KEY,
      description TEXT
    );`)
  }; 
  const createUsers = () => {
    db.query(`CREATE TABLE users (
      username VARCHAR PRIMARY KEY UNIQUE,
      avatar_url TEXT,
      name VARCHAR NOT NULL
    );`)
  };
  await Promise.all([createCategories(), createUsers()]);
  await db
    .query(`CREATE TABLE reviews (
          review_id SERIAL PRIMARY KEY,
          title VARCHAR NOT NULL,
          review_body TEXT NOT NULL,
          designer VARCHAR,
          review_img_url TEXT 
          DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
          votes INT DEFAULT 0,
          category VARCHAR REFERENCES categories(slug)
          ON DELETE SET NULL,
          owner VARCHAR REFERENCES users(username)
          ON DELETE SET NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`)
  await db
    .query(`CREATE TABLE comments (
          comment_id SERIAL PRIMARY KEY,
          author VARCHAR REFERENCES users(username)
          ON DELETE SET NULL,
          review_id INT REFERENCES reviews(review_id)
          ON DELETE CASCADE,
          votes INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          body TEXT NOT NULL
        )`)
    // 2. insert data
      const queryStr1 = format(
        `INSERT INTO categories (slug, description)
          VALUES %L RETURNING *;`,
          categoryData.map((category) => {
            return [category.slug, category.description];
          })
      );
      const insertCats = db.query(queryStr1);
 
      const queryStr2 = format(
        `INSERT INTO users (username, name, avatar_url)
          VALUES %L RETURNING *;`,
          userData.map((user) => {
            return [user.username, user.name, user.avatar_url];
          })
      );
      const insertUsers = db.query(queryStr2);

      const queryStr3 = format(
        `INSERT INTO reviews 
        (title, designer, owner, review_img_url, review_body, category, created_at, votes)
        VALUES %L RETURNING *;`,
        reviewData.map((review) => {
          return [review.title, review.designer, review.owner, review.review_img_url, review.review_body, review.category, review.created_at, review.votes];
        })
      );
      const insertReviews = db.query(queryStr3);

      const queryStr4 = format(
        `INSERT INTO comments
        (body, votes, author, review_id, created_at)
        VALUES %L RETURNING *;`,
        commentData.map((comment) => {
        return [comment.body, comment.votes, comment.author, comment.review_id, comment.created_at];
        })
      );
      const insertComments = db.query(queryStr4);
      await Promise.all([insertCats, insertUsers, insertReviews, insertComments]);
};

module.exports = seed;
