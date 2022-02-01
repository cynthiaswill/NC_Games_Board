const { client } = require("../socketIO/socketUser");

exports.fetchHistoryByRoom = async (room) => {
  const fetchHistory = async (roomName) => {
    const chatHistory = [];
    try {
      await client.connect();
      const database = client.db("My_test_project");
      const history = database.collection("chatHistory");
      // query for chatHistory with the matching roomName
      const query = { roomName: `${roomName}` };
      const options = {
        // sort returned documents in ascending order by title (A->Z)
        sort: { timestamp: 1 },
        projection: { _id: 1, username: 1, messageBody: 1, dateCreated: 1 },
      };
      const cursor = history.find(query, options);
      if ((await cursor.count()) === 0) {
        console.log("No documents found!");
      }
      await cursor.forEach((item) => {
        chatHistory.push(item);
      });
    } finally {
      await client.close();
    }
    return chatHistory;
  };

  return await fetchHistory(room);
};

exports.fetchOnlineUsers = async () => {
  try {
    await client.connect();
    const database = client.db("My_test_project");
    const history = database.collection("chatHistory");
    // query for chatHistory with the matching roomName
    const query = { title: "online users list" };
    const options = {
      projection: { onlineUsers: 1 },
    };
    const list = await history.findOne(query, options);
    console.log(list, "online_user_list");
    return list;
  } finally {
    await client.close();
  }
};

exports.renewOnlineUsers = async (list) => {
  try {
    await client.connect();

    const database = client.db("My_test_project");
    const history = database.collection("chatHistory");

    const filter = { title: "online users list" };

    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true };

    const updateDoc = {
      $set: {
        onlineUsers: [...list],
      },
    };

    const result = await history.updateOne(filter, updateDoc, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );
    return { onlineUsers: [...list] };
  } finally {
    await client.close();
  }
};
