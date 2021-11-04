const apiRouter = require('express').Router();
const categoriesRouter = require('./categories.router.js');
const reviewsRouter = require('./reviews.router.js');
const commentsRouter = require('./comments.router.js');
const { getOverview } = require('../controllers/controller');
const { handleBadMethods } = require('../controllers/error.controller');

apiRouter.use('/categories', categoriesRouter);
apiRouter.use('/reviews', reviewsRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.route('/').get(getOverview).all(handleBadMethods);

module.exports = apiRouter;