const {
    selectUsers,
    selectUser,
    insertUser,
} = require("../models/users.model");

exports.getUsers = (req, res, next) => {
    selectUsers()
        .then((users) => {
            res.send({ users });
        })
        .catch(next);
};

exports.getUser = (req, res, next) => {
    const { username } = req.params;
    selectUser(username)
        .then((user) => {
            res.send({ user });
        })
        .catch(next);
};

exports.postUser = (req, res, next) => {
    const { username, name, avatar_url } = req.body;

    insertUser(username, name, avatar_url)
        .then((user) => {
            res.status(201).send({ user });
        })
        .catch(next);
};
