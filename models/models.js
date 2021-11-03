const db = require('../db/connection');

exports.selectCategories = () => {
    return db.query(`SELECT * FROM categories;`)
        .then(({rows}) => {
            return rows;
        });
};

exports.selectReviewById = async (id) => {   
    const queryStr = `SELECT reviews.*,
     COALESCE(COUNT(comments.review_id),0) AS comment_count FROM reviews 
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
        }   else {
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
    COALESCE(COUNT(comments.review_id),0) AS comment_count FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id `
    if (category) {
        queryStr += ` WHERE category = $1`;
        queryValues.push(category)
      }
        queryStr += ` GROUP BY reviews.review_id`
        queryStr += ` ORDER BY ${sort} ${order}`
      const { rows } = await db.query(queryStr, queryValues)

          if (rows.length === 0) {
            return Promise.reject({ status: '404', msg: 'Item not found'})
          } else {
             return rows;
          }
      }
