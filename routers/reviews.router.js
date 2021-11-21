const reviewsRouter = require("express").Router();
const {
    handleBadMethods,
} = require("../controllers/error.controller");
const {
    getReviews,
    getReviewById,
    patchReview,
    postReview,
} = require("../controllers/reviews.controller");
const {
    getComments,
    postComment,
} = require("../controllers/comments.controller");

reviewsRouter
    .route("/")
    .get(getReviews)
    .post(postReview)
    .all(handleBadMethods);

reviewsRouter
    .route("/:review_id")
    .get(getReviewById)
    .patch(patchReview)
    .all(handleBadMethods);

reviewsRouter
    .route("/:review_id/comments")
    .get(getComments)
    .post(postComment)
    .all(handleBadMethods);

module.exports = reviewsRouter;
