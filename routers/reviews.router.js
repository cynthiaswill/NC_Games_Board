const reviewsRouter = require('express').Router();
const { handleBadMethods } = require('../controllers/error.controller');
const { 
    getReviews, 
    getReviewById, 
    patchReview, 
    getComments, 
    postComment 
} = require('../controllers/controller');

reviewsRouter
    .route('/')
    .get(getReviews)
    .all(handleBadMethods);

reviewsRouter
    .route('/:review_id')
    .get(getReviewById)
    .patch(patchReview)
    .all(handleBadMethods);
    
reviewsRouter
    .route('/:review_id/comments')
    .get(getComments)
    .post(postComment)
    .all(handleBadMethods);

module.exports = reviewsRouter;