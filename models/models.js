const db = require('../db/connection');

exports.selectCategories = () => {
    console.log('in models')
    return db.query(`SELECT * FROM categories;`)
        .then(({rows}) => {
            return rows;
        })
}