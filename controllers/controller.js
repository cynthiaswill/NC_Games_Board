const {
    selectCategories,
    selectReviews,
    selectReviewById
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

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    selectReviewById(review_id).then(review => {
        res.send({ review });
    })
    .catch(next)
};

exports.patchReview = (req, res, next) => {
    const { review_id } = req.params;
    selectReviewById(review_id).then(review => {
        res.send({ review });
    })
    .catch(next)
};