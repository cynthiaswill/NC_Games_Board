const db = require('../db/connection');
const { readFile } = require('fs/promises');

exports.selectCategories = async () => {
    const { rows } = await db.query(`SELECT * FROM categories;`)
    return rows;
};

exports.selectReviewById = async (id) => {   
    const queryStr = `SELECT reviews.*,
     COUNT(comments.review_id)::INT AS comment_count FROM reviews 
     LEFT JOIN comments ON reviews.review_id = comments.review_id 
     WHERE reviews.review_id = $1 
     GROUP BY reviews.review_id;`
    const { rows } = await db.query(queryStr, [id])
        if (rows.length !== 0) {
            return rows[0];
        }   else {
            return Promise.reject({
                status: '404',
                msg: 'This review does not exist!'
            });
        }
};

exports.updateReview = async (id, vote) => {
    const review = await db.query(`UPDATE reviews SET votes = votes + $2 
        WHERE review_id = $1 RETURNING *`, [id, vote]);
        if (vote !== undefined) {
            if (review.rows.length !== 0) {
                return review.rows[0];
            }       else {
                return Promise.reject({ 
                    status: '404',
                    msg: 'This review does not exist!'
                })
            }
        }   else {
            return Promise.reject({ 
                status: '400',
                msg: 'Bad request or invalid input'
            })
        }    
};

exports.selectReviews = async (sort = 'created_at', order = 'desc', category) => {
    let queryValues = [];
    let queryStr = `SELECT reviews.*,
    COUNT(comments.review_id)::INT AS comment_count FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id `
    if (category) {
        queryStr += ` WHERE category = $1`;
        queryValues.push(category)
      }
        queryStr += ` GROUP BY reviews.review_id`
        queryStr += ` ORDER BY ${sort} ${order}`
      const { rows } = await db.query(queryStr, queryValues)

          if (rows.length === 0 && category !== undefined) {
              const categoryResult = await db
              .query(`SELECT * FROM categories WHERE slug = $1`, [category])
              if (categoryResult.rows.length === 0) {
                return Promise.reject({ status: '404', msg: 'Category not found'})
              } else {
                  return Promise.reject({ status: '404', msg: 'Review not found'})
              } 
          } else {
             return rows;
          }
      }

exports.selectComments = async (id) => {
    const queryStr = `SELECT 
        comments.comment_id, 
        comments.votes, 
        comments.created_at, 
        comments.author, 
        comments.body 
        FROM comments 
        LEFT JOIN users ON comments.author = users.username 
        WHERE comments.review_id = $1`
    const { rows } = await db.query(queryStr, [id])
    const reviewResult = await db.query(`SELECT * FROM reviews WHERE review_id = $1`, [id])

    if (rows.length !== 0) {
        return rows;
    }   else if (reviewResult.rows.length === 0) {
        return Promise.reject({
            status: '404',
            msg: 'This review_id does not exist!'
        });
    }   else    {
        return Promise.reject({
            status: '404',
            msg: 'No comment found'
        });
    }
}

exports.insertComment = async (id, name, body) => {
    const queryStr = `INSERT INTO comments 
        (body, author, review_id)
        VALUES ($1, $2, $3)
        RETURNING *;`

    if (name === undefined || body === undefined) {
        return Promise.reject({
            status: '400',
            msg: 'Invalid post request body'
        });
    }   else if (name === null || body === null) {
        return Promise.reject({
            status: '400',
            msg: 'Username or post body cannot be null!'
        });
    }   else {
        const { rows }= await db.query(queryStr, [body, name, id]);
    if (rows.length !== 0) {
        return rows[0];
    }      else {
        return Promise.reject({
            status: '404',
            msg: 'This review_id does not exist!'
        });
    }
    }
}

exports.removeComment = async (id) => {
    const { rows } = await db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [id])
    if (rows.length !== 0) {
        return rows[0]
    }   else {
        return Promise.reject({
            status: '404',
            msg: 'This comment_id does not exist!'
        });
    }
}

exports.readOverview = async () => {
    const overview = await readFile('./endpoints.json', 'utf8')
    if (overview) {
        return JSON.parse(overview);
    }   else {
        return Promise.reject({
            status: '404',
            msg: 'Overview file not found.'
        });
    }   
}

exports.selectUsers = async () => {
    const { rows } = await db
        .query(`SELECT users.username FROM users;`)
    return rows;
}