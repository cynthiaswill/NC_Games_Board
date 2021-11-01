const reviewsRouter = require('express').Router();
const { getReviews, getReviewById } = require('../controllers/controller');

reviewsRouter.route('/').get(getReviews);
reviewsRouter.route('/:review_id').get(getReviewById);

module.exports = reviewsRouter;