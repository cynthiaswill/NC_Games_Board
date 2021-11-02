const db = require('../db/connection');

exports.selectCategories = () => {
    return db.query(`SELECT * FROM categories;`)
        .then(({rows}) => {
            return rows;
        });
};

exports.selectReviews = () => {
    return db.query(`SELECT * FROM reviews;`)
        .then(({ rows }) => {
            return rows;
        });
};

exports.selectReviewById = (id) => {
    const queryStr = `SELECT reviews.*,
     COUNT(reviews.review_id) AS comment_count FROM comments 
     JOIN reviews ON comments.review_id = reviews.review_id 
     WHERE comments.review_id = $1 
     GROUP BY reviews.review_id;`
    return db.query(queryStr, [id])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({
                    status: '404',
                    msg: 'This review does not exist!'
                    });
            }   else {
                return rows[0];
            }
        })
};