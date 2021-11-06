const {
    selectUsers,
    selectUser,
}   = require('../models/users.model');

exports.getUsers = (req, res, next) => {
    selectUsers().then( users => {
        res.send({ users })
    })
    .catch(next)
}

exports.getUser = (req, res, next) => {
    const { username } = req.params;
    selectUser(username).then(user => {
        res.send({ user })
    })
    .catch(next)
}
