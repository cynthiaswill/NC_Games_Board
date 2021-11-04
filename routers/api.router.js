const apiRouter = require('express').Router();
const categoriesRouter = require('./categories.router');
const reviewsRouter = require('./reviews.router');
const commentsRouter = require('./comments.router');
const usersRouter = require('./users.router');
const { getOverview } = require('../controllers/controller');
const { handleBadMethods } = require('../controllers/error.controller');

apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.route('/').get(getOverview).all(handleBadMethods);

module.exports = apiRouter;