const {
    selectCategories,
    insertCategory,
} = require("../models/categories.model");

exports.getCategories = (req, res, next) => {
    selectCategories()
        .then((categories) => {
            res.send({ categories });
        })
        .catch(next);
};

exports.postCategory = (req, res, next) => {
    const { slug, description } = req.body;

    insertCategory(slug, description)
        .then((category) => {
            res.status(201).send({ category });
        })
        .catch(next);
};
