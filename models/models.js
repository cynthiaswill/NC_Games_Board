const db = require('../db/connection');

exports.selectCategories = () => {
    return db.query(`SELECT * FROM categories;`)
        .then(({rows}) => {
            return rows;
        });
};

exports.selectReviewById = async (id) => {   
    const queryStr1 = `SELECT reviews.*,
     COALESCE(COUNT(comments.review_id),0) AS comment_count FROM reviews 
     LEFT JOIN comments ON reviews.review_id = comments.review_id 
     WHERE reviews.review_id = $1 
     GROUP BY reviews.review_id;`
    const { rows } = await db.query(queryStr1, [id])
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

exports.selectReviews = async () => {
    const queryStr1 = `SELECT reviews.*,
    COALESCE(COUNT(comments.review_id),0) AS comment_count FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id 
    GROUP BY reviews.review_id;`
    const { rows } = await db.query(queryStr1)
    return rows;
    // return db.query(`SELECT * FROM reviews;`)
    //     .then(({ rows }) => {
    //         return rows;
    //     });
};