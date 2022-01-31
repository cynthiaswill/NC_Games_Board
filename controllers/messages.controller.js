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
      console.log(list);
      res.send({ list });
    })
    .catch(next);
};
