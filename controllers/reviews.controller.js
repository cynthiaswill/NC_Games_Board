const {
  selectReviews,
  selectReviewById,
  updateReview,
  insertReview,
  removeReview,
  getReviewSubsById,
  subscribeReviewById,
  unsubscribeReviewById,
  getWatchedListByReviewId,
  watchById,
  unwatchById,
} = require("../models/reviews.model");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;
  selectReviewById(review_id)
    .then((review) => {
      res.send({ review });
    })
    .catch(next);
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  const { inc_votes, review_body } = req.body;

  updateReview(review_id, inc_votes, review_body)
    .then((review) => {
      res.send({ review });
    })
    .catch(next);
};

exports.getReviews = (req, res, next) => {
  const { sort_by, order, category, limit, p } = req.query;
  const queryKeys = Object.keys(req.query);

  selectReviews(sort_by, order, category, limit, p, queryKeys)
    .then((reviews) => {
      res.send({ reviews });
    })
    .catch(next);
};

exports.postReview = (req, res, next) => {
  const { owner, title, review_body, designer, category } = req.body;

  insertReview(owner, title, review_body, designer, category)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch(next);
};

exports.deleteReview = (req, res, next) => {
  const { review_id } = req.params;

  removeReview(review_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

exports.getVotedByReviewId = (req, res, next) => {
  const { review_id } = req.params;

  getReviewSubsById(review_id)
    .then((list) => {
      res.send({ list });
    })
    .catch(next);
};

exports.voteReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { username } = req.body;

  subscribeReviewById(review_id, username)
    .then((list) => {
      res.send({ list });
    })
    .catch(next);
};

exports.unvoteReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { username } = req.body;

  unsubscribeReviewById(review_id, username)
    .then((list) => {
      res.send({ list });
    })
    .catch(next);
};

exports.getWatchedByReviewId = (req, res, next) => {
  const { review_id } = req.params;

  getWatchedListByReviewId(review_id)
    .then((list) => {
      res.send({ list });
    })
    .catch(next);
};

exports.watchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { username } = req.body;

  watchById(review_id, username)
    .then((list) => {
      res.send({ list });
    })
    .catch(next);
};

exports.unwatchReviewById = (req, res, next) => {
  const { review_id } = req.params;
  const { username } = req.body;

  unwatchById(review_id, username)
    .then((list) => {
      res.send({ list });
    })
    .catch(next);
};
