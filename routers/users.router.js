const usersRouter = require("express").Router();
const {
  getUsers,
  getUser,
  postUser,
  patchUser,
  getWatchedByUsername,
} = require("../controllers/users.controller");
const { handleBadMethods } = require("../controllers/error.controller");

usersRouter.route("/").get(getUsers).post(postUser).all(handleBadMethods);

usersRouter.route("/:username").get(getUser).patch(patchUser).all(handleBadMethods);

usersRouter.route("/:username/watched").get(getWatchedByUsername).all(handleBadMethods);

module.exports = usersRouter;
