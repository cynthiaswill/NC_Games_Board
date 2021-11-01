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
            return rows[0];
        })
}