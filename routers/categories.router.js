const categoriesRouter = require('express').Router();
const { getCategories } = require('../controllers/controller');
const { handleBadMethods } = require('../controllers/error.controller');

categoriesRouter.route('/').get(getCategories).all(handleBadMethods);

module.exports = categoriesRouter;