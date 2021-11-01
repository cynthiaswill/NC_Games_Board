const reviewsRouter = require('express').Router();
const { getReviews } = require('../controllers/controller');

reviewsRouter.route('/').get(getReviews);

module.exports = reviewsRouter;