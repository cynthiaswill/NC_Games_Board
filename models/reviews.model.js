const db = require('../db/connection');

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

            const categoryResult = await db
            .query(`SELECT * FROM categories WHERE slug = $1`, [category])
            if (category && categoryResult.rows.length === 0) {
                return Promise.reject({ status: '404', msg: 'Category not found'})
            } else {
                return rows;
            }
}
