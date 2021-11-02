
exports.handle404 = (err, req, res, next) => {
    if (err.status === '404') {
        res.status(404).send({ msg: err.msg });
    }   else next(err);
}

exports.handle400 = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: 'Bad request, invalid input'})
    }   else next(err);
}
