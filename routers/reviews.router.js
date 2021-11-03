const reviewsRouter = require('express').Router();
const { 
    getReviews, 
    getReviewById, 
    patchReview, 
    getComments, 
    postComment 
} = require('../controllers/controller');

reviewsRouter
    .route('/').
    get(getReviews);

reviewsRouter
    .route('/:review_id')
    .get(getReviewById)
    .patch(patchReview);
    
reviewsRouter
    .route('/:review_id/comments')
    .get(getComments)
    .post(postComment);

module.exports = reviewsRouter;