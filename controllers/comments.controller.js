const {
  selectComments,
  insertComment,
  removeComment,
  updateComment,
  getCommentSubsById,
  subscribeCommentById,
  unsubscribeCommentById,
} = require("../models/comments.model");

exports.getComments = (req, res, next) => {
  const { review_id } = req.params;
  const { limit, p } = req.query;
  const queryKeys = Object.keys(req.query);

  selectComments(review_id, limit, p, queryKeys)
    .then((comments) => {
      res.send({ comments });
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  const { username, body } = req.body;

  insertComment(review_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;

  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes, body } = req.body;
  updateComment(comment_id, inc_votes, body)
    .then((comment) => {
      res.send({ comment });
    })
    .catch(next);
};

exports.getVotedByCommentId = (req, res, next) => {
  const { comment_id } = req.params;

  getCommentSubsById(comment_id)
    .then((list) => {
      res.send({ list });
    })
    .catch(next);
};

exports.voteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { username } = req.body;

  subscribeCommentById(comment_id, username)
    .then((list) => {
      res.send({ list });
    })
    .catch(next);
};

exports.unvoteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { username } = req.body;

  unsubscribeCommentById(comment_id, username)
    .then((list) => {
      res.send({ list });
    })
    .catch(next);
};
