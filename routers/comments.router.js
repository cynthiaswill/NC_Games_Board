const commentsRouter = require('express').Router();
const { deleteComment, patchComment } = require('../controllers/controller');
const { handleBadMethods } = require('../controllers/error.controller');

commentsRouter
    .route('/:comment_id')
    .delete(deleteComment)
    .patch(patchComment)
    .all(handleBadMethods);

module.exports = commentsRouter;