const { fetchHistoryByRoom, fetchOnlineUsers } = require("../models/messages.model");

exports.getHistoryByRoom = (req, res, next) => {
  const { room } = req.params;
  fetchHistoryByRoom(room)
    .then((history) => {
      res.send({ history });
    })
    .catch(next);
};

exports.getOnlineUsers = (req, res, next) => {
  fetchOnlineUsers()
    .then((list) => {
      res.send({ list });
    })
    .catch(next);
};

exports.updateOnlineUsers = (req, res, next) => {
  const { onlineUsers } = req.body;
  renewOnlineUsers(onlineUsers)
    .then((list) => {
      res.send({ list });
    })
    .catch(next);
};
