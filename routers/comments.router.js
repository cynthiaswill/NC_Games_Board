const commentsRouter = require('express').Router();
const { deleteComment } = require('../controllers/controller');
const { handleBadMethods } = require('../controllers/error.controller');

commentsRouter.route('/:comment_id').delete(deleteComment).all(handleBadMethods);

module.exports = commentsRouter;