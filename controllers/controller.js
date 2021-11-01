const {
    selectCategories,
    selectReviews
}   = require('../models/models.js');

exports.getCategories = (req, res, next) => {
    selectCategories().then(categories => {
        res.send({ categories });
    })
    .catch(next)
};

exports.getReviews = (req, res, next) => {
    selectReviews().then(reviews => {
        res.send({ reviews });
    })
    .catch(next)
};

