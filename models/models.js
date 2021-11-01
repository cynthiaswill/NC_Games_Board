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