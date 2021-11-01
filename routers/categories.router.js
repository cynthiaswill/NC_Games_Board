const categoriesRouter = require('express').Router();
const { getCategories } = require('../controllers/controller');

categoriesRouter.route('/').get(getCategories);

module.exports = categoriesRouter;