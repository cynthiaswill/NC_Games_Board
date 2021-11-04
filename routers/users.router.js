const usersRouter = require('express').Router();
const { getUsers } = require('../controllers/controller');
const { handleBadMethods } = require('../controllers/error.controller');

usersRouter.route('/').get(getUsers).all(handleBadMethods);

module.exports = usersRouter;