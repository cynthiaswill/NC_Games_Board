const { fetchHistoryByRoom } = require("../models/messages.model");

exports.getHistoryByRoom = (req, res, next) => {
  const { room } = req.params;
  fetchHistoryByRoom(room)
    .then((history) => {
      res.send({ history });
    })
    .catch(next);
};
