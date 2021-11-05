
exports.handleBadPaths = (req, res) => {
    res.status(404).send({ msg: 'Invalid path' })
};

exports.handleBadMethods = (req, res) => {
    res.status(405).send({ msg: 'Method not allowed'})
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status == '404' || err.status == '400') {
        res.status(err.status).send({ msg: err.msg });
    }   else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
    console.log(err);
    if (err.code === '22P02' || err.code === '42601' || err.code === '2201W') {
        res.status(400).send({ msg: 'Bad request or invalid input'})
    }   else if (err.code === '42703') {
        res.status(400).send({ msg: 'Bad request: no such column!'})
    }   else if (err.code === '23503') {
        res.status(400).send({ msg: 'Username does not exist!'})
    }   else next(err);
};

exports.handle500 = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error'})
};