const messagesRouter = require("express").Router();
const { getHistoryByRoom } = require("../controllers/messages.controller");
const { handleBadMethods } = require("../controllers/error.controller");

messagesRouter.route("/:room").get(getHistoryByRoom).all(handleBadMethods);

module.exports = messagesRouter;
