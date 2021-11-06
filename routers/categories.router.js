const categoriesRouter = require('express').Router();
const { getCategories } = require('../controllers/categories.controller');
const { handleBadMethods } = require('../controllers/error.controller');

categoriesRouter.route('/').get(getCategories).all(handleBadMethods);

module.exports = categoriesRouter;