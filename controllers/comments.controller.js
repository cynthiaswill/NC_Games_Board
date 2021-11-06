const {
    selectComments,
    insertComment,
    removeComment,
    updateComment
}   = require('../models/comments.model');

exports.getComments = (req, res, next) => {
    const { review_id } = req.params;
    const { limit, p } = req.query;
    const queryKeys = Object.keys(req.query);

    selectComments(review_id, limit, p, queryKeys).then(comments => {
        res.send({ comments })
    })
    .catch(next)
}

exports.postComment = (req, res, next) => {
    const { review_id } = req.params;
    const { username, body } = req.body;

    insertComment(review_id, username, body).then(comment => {
        res.status(201).send({ comment })
    })
    .catch(next)
}

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params;

    removeComment(comment_id).then(() => {
        res.status(204).send();
    })
    .catch(next)
}

exports.patchComment = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    updateComment(comment_id, inc_votes).then(comment => {
        res.send({ comment })
    })
    .catch(next)
}
