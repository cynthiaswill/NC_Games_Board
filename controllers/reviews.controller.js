const {
    selectReviews,
    selectReviewById,
    updateReview 
} = require('../models/reviews.model');

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    selectReviewById(review_id).then(review => {
        res.send({ review });
    })
    .catch(next)
};

exports.patchReview = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;
    updateReview(review_id, inc_votes).then(review => {
        res.send({ review });
    })
    .catch(next)
};

exports.getReviews = (req, res, next) => {
    const { sort_by, order, category, limit, p } = req.query;
    const queryKeys = Object.keys(req.query);

    selectReviews(sort_by, order, category, limit, p, queryKeys)
    .then(reviews => {
        res.send({ reviews });
    })
    .catch(next);
};
