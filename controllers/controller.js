const {
    selectCategories,
    selectReviews,
    selectReviewById,
    updateReview,
    selectComments,
    insertComment,
    removeComment,
    readOverview,
    selectUsers,
    selectUser,
    updateComment
}   = require('../models/models.js');

exports.getCategories = (req, res, next) => {
    selectCategories().then(categories => {
        res.send({ categories });
    })
    .catch(next)
};

exports.getReviewById = (req, res, next) => {
    const { review_id } = req.params;
    selectReviewById(review_id).then(review => {
        res.send({ review });
    })
    .catch(next)
};

exports.patchReview = (req, res, next) => {
    const { review_id } = req.params;
    const { inc_votes } = req.body;
    updateReview(review_id, inc_votes).then(review => {
        res.send({ review });
    })
    .catch(next)
};

exports.getReviews = (req, res, next) => {
    const { sort_by, order, category, limit, p } = req.query;
    const queryKeys = Object.keys(req.query);

    selectReviews(sort_by, order, category, limit, p, queryKeys)
    .then(reviews => {
        res.send({ reviews });
    })
    .catch(next);
};

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

exports.getOverview = (req, res, next) => {
    readOverview().then(overview => {
        res.send({ overview })
    })
    .catch(next)
}

exports.getUsers = (req, res, next) => {
    selectUsers().then( users => {
        res.send({ users })
    })
    .catch(next)
}

exports.getUser = (req, res, next) => {
    const { username } = req.params;
    selectUser(username).then(user => {
        res.send({ user })
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