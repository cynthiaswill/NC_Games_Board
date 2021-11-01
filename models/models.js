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
    return db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [id])
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