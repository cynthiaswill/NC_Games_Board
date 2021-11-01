const {
    selectCategories
}   = require('../models/models.js');

exports.getCategories = (err, rec, res, next) => {
    selectCategories().then(categories => {
        res.send(categories);
    })
    .catch(next)
}

