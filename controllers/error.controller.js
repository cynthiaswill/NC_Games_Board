exports.handleBadPaths = (req, res) => {
    res.status(404).send({ msg: "Invalid path" });
};

exports.handleBadMethods = (req, res) => {
    res.status(405).send({ msg: "Method not allowed" });
};

exports.handleCustomErrors = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg });
    } else next(err);
};

exports.handlePSQLErrors = (err, req, res, next) => {
    console.log(err.code);
    if (["22P02", "42601", "2201W", "2201X"].includes(err.code)) {
        res.status(400).send({ msg: "Bad request or invalid input" });
    } else if (err.code === "42703") {
        res.status(400).send({
            msg: "No such column in database or invalid order type",
        });
    } else if (err.code === "23503") {
        res.status(422).send({
            msg: "Unprocessable: username or review_id not found!",
        });
    } else if (err.code === "23502") {
        res.status(400).send({
            msg: "missing required field(s)!",
        });
    } else next(err);
};

exports.handle500 = (err, req, res, next) => {
    res.status(500).send({ msg: "Internal server error" });
};
