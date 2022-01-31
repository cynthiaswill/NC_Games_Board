const { fetchHistory, fetchUserList } = require("../socketIO/fetchHistory");

exports.fetchHistoryByRoom = async (room) => {
  return await fetchHistory(room);
};

exports.fetchOnlineUsers = async () => {
  return await fetchUserList();
};
