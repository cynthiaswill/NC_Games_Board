const usersRouter = require("express").Router();
const {
    getUsers,
    getUser,
    postUser,
    patchUser,
} = require("../controllers/users.controller");
const {
    handleBadMethods,
} = require("../controllers/error.controller");

usersRouter
    .route("/")
    .get(getUsers)
    .post(postUser)
    .all(handleBadMethods);

usersRouter
    .route("/:username")
    .get(getUser)
    .patch(patchUser)
    .all(handleBadMethods);

module.exports = usersRouter;
