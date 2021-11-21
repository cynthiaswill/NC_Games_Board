const categoriesRouter = require("express").Router();
const {
    getCategories,
    postCategory,
} = require("../controllers/categories.controller");
const {
    handleBadMethods,
} = require("../controllers/error.controller");

categoriesRouter
    .route("/")
    .get(getCategories)
    .post(postCategory)
    .all(handleBadMethods);

module.exports = categoriesRouter;
