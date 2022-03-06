const commentsRouter = require("express").Router();
const {
  deleteComment,
  patchComment,
  getVotedByCommentId,
  voteCommentById,
  unvoteCommentById,
} = require("../controllers/comments.controller");
const { handleBadMethods } = require("../controllers/error.controller");

commentsRouter
  .route("/:comment_id")
  .delete(deleteComment)
  .patch(patchComment)
  .all(handleBadMethods);

commentsRouter
  .route("/:comment_id/voted")
  .get(getVotedByCommentId)
  .post(voteCommentById)
  .patch(unvoteCommentById)
  .all(handleBadMethods);

module.exports = commentsRouter;
