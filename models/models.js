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

exports.selectReviews = async (sort = 'created_at', order = 'desc', category, limit = 10, p = 1, queryKeys) => {
    const validQueries = ['sort_by', 'order', 'category', 'limit', 'p'];
    if (!queryKeys.every( key => validQueries.includes(key))) {
        return Promise.reject({status:'400', msg: 'Invalid: not a query'})
    };
    const offset = (p - 1) * limit;
    const queryValues = [limit, offset];
    let queryStr = `SELECT reviews.*,
    COUNT(comments.review_id)::INT AS comment_count, 
    COUNT(*) OVER()::INT AS total_count 
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id `
    if (category) {
        queryValues.push(category);
        queryStr += ` WHERE category = $3`;
      }
        queryStr += ` GROUP BY reviews.review_id`

        if (['title', 'designer', 'owner', 'category', 'created_at', 'votes'].includes(sort) && 
            ['ASC', 'asc', 'desc', 'DESC'].includes(order)) {
            queryStr += ` ORDER BY ${sort} ${order}`
        }   else {
            return Promise.reject({ status: '400', msg: 'No such column in database or invalid order type'})
        }
        queryStr += ` LIMIT $1 OFFSET $2`
      
      const { rows } = await db.query(queryStr, queryValues)

          if (rows.length === 0) {
              const categoryResult = await db
              .query(`SELECT * FROM categories WHERE slug = $1`, [category])
              if (category && categoryResult.rows.length === 0) {
                return Promise.reject({ status: '404', msg: 'Category not found'})
              } else {
                  return Promise.reject({ status: '404', msg: 'Review not found or empty page'})
              } 
          } else {
             return rows;
          }
      }

exports.selectComments = async (id, limit = 10, p = 1, queryKeys) => {
    const validQueries = ['limit', 'p'];
    if (!queryKeys.every( key => validQueries.includes(key))) {
        return Promise.reject({status:'400', msg: 'Invalid: not a query'})
    };
    const offset = (p - 1) * limit;
    const queryStr = `SELECT 
        comments.comment_id, 
        comments.votes, 
        comments.created_at, 
        comments.author, 
        comments.body 
        FROM comments 
        LEFT JOIN users ON comments.author = users.username 
        WHERE comments.review_id = $1
        LIMIT $2 OFFSET $3`
    const { rows } = await db.query(queryStr, [id, limit, offset])
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
            msg: 'No comment found or empty page'
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
        return rows[0];
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

exports.selectUser = async (username) => {
    const { rows } = await db
        .query(`SELECT users.username, users.avatar_url, users.name
            FROM users WHERE username = $1`, [username]);
    if (rows.length !== 0) {
        return rows[0];
    }   
    else if (/[^\w]/.test(username) ) {
        return Promise.reject({ 
            status: '400', 
            msg: 'Invalid username!'
        })
    }   else {
        return Promise.reject({ 
            status: '404', 
            msg: 'Username not found!'
        })
    }
}

exports.updateComment = async (id, votes) => {
    const { rows } = await db
        .query(`UPDATE comments SET votes = votes + $2 
            WHERE comment_id = $1 RETURNING *`, [id, votes])
    if (votes !== undefined) {
        if (rows.length !== 0) {
            return rows[0];
        }   else {
            return Promise.reject({ 
                status: '404', 
                msg: 'This comment_id does not exist!'
            })
        }
    }   else {
        return Promise.reject({ 
            status: '400',
            msg: 'Bad request or invalid input'
        })
    }
}