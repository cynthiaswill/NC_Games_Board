const overview = require('../endpoints.json');

exports.getOverview = (req, res, next) => {
    res.send(overview);
}
