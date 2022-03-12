const {
  selectUsers,
  selectUser,
  insertUser,
  updateUser,
  getWatchedListByUsername,
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

exports.patchUser = (req, res, next) => {
  const { username } = req.params;
  const { name, avatar_url } = req.body;

  updateUser(username, name, avatar_url)
    .then((user) => {
      res.send({ user });
    })
    .catch(next);
};

exports.getWatchedByUsername = (req, res, next) => {
  const { username } = req.params;

  getWatchedListByUsername(username)
    .then((list) => {
      res.send({ list });
    })
    .catch(next);
};
