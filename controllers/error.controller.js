
exports.handleCustomErrors = (err, req, res, next) => {
    console.log(err)
    if (err.status === '404' || err.status === '400') {
        res.status(err.status).send({ msg: err.msg });
    }   else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
    if (err.code === '22P02' || err.code === '42601') {
        res.status(400).send({ msg: 'Bad request or invalid input'})
    }   else if (err.code === '42703') {
        res.status(400).send({ msg: 'Bad request: no such column!'})
    }   else next(err);
};

exports.handle500 = (err, req, res, next) => {
    res.status(500).send({ msg: 'Internal server error'})
}