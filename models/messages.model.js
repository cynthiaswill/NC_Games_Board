const { fetchHistory } = require("../socketIO/fetchHistory");

exports.fetchHistoryByRoom = async (room) => {
  const data = await fetchHistory(room);
  return data;
};
