const reviewsRouter = require('express').Router();
const { getReviews, getReviewById, patchReview, getComments } = require('../controllers/controller');

reviewsRouter.route('/').get(getReviews);
reviewsRouter.route('/:review_id').get(getReviewById).patch(patchReview);
reviewsRouter.route('/:review_id/comments').get(getComments);

module.exports = reviewsRouter;