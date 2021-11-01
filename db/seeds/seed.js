const db = require('../connection.js');

const seed = (data) => {
  const { categoryData, commentData, reviewData, userData } = data;
  // 1. create tables
  return db
    .query(`DROP TABLE IF EXISTS categories;`)
    .then(() => {
      return db
        .query(`CREATE TABLE categories (
          slug VARCHAR PRIMARY KEY,
          description TEXT
        );`)
    })
    .then(() => {
      return db
        .query(`DROP TABLE IF EXISTS users;`)
        .then(() => {
          return db
            .query(`CREATE TABLE users (
              username VARCHAR PRIMARY KEY UNIQUE,
              avatar_url TEXT,
              name VARCHAR NOT NULL
            );`)
        })
        .then(() => {
          return db
            .query(`DROP TABLE IF EXISTS reviews;`)
        })
        .then(() => {
          return db
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
              created_at TIMESTAMP
            );`)
        })
        .then(() => {
          return db
            .query(`DROP TABLE IF EXISTS comments;`)
        })
        .then(() => {
          return db
            .query(`CREATE TABLE comments (
              comment_id SERIAL PRIMARY KEY,
              author VARCHAR REFERENCES users(username)
              ON DELETE SET NULL,
              review_id INT REFERENCES reviews(review_id)
              ON DELETE CASCADE,
              votes INT NOT NULL,
              created_at TIMESTAMP,
              body TEXT NOT NULL
            )`)
        })
    })



  // 2. insert data


};

module.exports = seed;
