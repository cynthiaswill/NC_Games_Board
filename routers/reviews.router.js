const reviewsRouter = require('express').Router();
const { getReviews, getReviewById, patchReview } = require('../controllers/controller');

reviewsRouter.route('/').get(getReviews);
reviewsRouter.route('/:review_id').get(getReviewById).patch(patchReview);

module.exports = reviewsRouter;