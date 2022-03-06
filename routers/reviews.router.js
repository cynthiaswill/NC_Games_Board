const reviewsRouter = require("express").Router();
const { handleBadMethods } = require("../controllers/error.controller");
const {
  getReviews,
  getReviewById,
  patchReview,
  postReview,
  deleteReview,
  getVotedByReviewId,
  voteReviewById,
  unvoteReviewById,
} = require("../controllers/reviews.controller");
const { getComments, postComment } = require("../controllers/comments.controller");

reviewsRouter.route("/").get(getReviews).post(postReview).all(handleBadMethods);

reviewsRouter
  .route("/:review_id")
  .get(getReviewById)
  .patch(patchReview)
  .delete(deleteReview)
  .all(handleBadMethods);

reviewsRouter
  .route("/:review_id/comments")
  .get(getComments)
  .post(postComment)
  .all(handleBadMethods);

reviewsRouter
  .route("/:review_id/voted")
  .get(getVotedByReviewId)
  .post(voteReviewById)
  .patch(unvoteReviewById)
  .all(handleBadMethods);

module.exports = reviewsRouter;
