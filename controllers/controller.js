const {
    selectCategories
}   = require('../models/models.js');

exports.getCategories = (err, rec, res, next) => {
    selectCategories().then(categories => {
        console.log('in controllers')
        res.send(categories);
    })
    .catch(next)
}

