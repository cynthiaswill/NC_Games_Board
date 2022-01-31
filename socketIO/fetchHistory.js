const { client } = require("./socketUser");

async function fetchHistory(roomName) {
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
      // Include only the `username` and `text` fields in each returned document
      projection: { _id: 1, username: 1, messageBody: 1, dateCreated: 1 },
    };
    const cursor = history.find(query, options);
    // print a message if no documents were found
    if ((await cursor.count()) === 0) {
      console.log("No documents found!");
    }
    // replace console.dir with your callback to access individual elements
    await cursor.forEach((item) => {
      chatHistory.push(item);
    });
  } finally {
    await client.close();
  }
  return chatHistory;
}

async function fetchUserList() {
  try {
    await client.connect();
    const database = client.db("My_test_project");
    const history = database.collection("chatHistory");
    // query for chatHistory with the matching roomName
    const query = { title: "online users list" };
    const options = {
      // Include only the `username` and `text` fields in each returned document
      projection: { onlineUsers: 1 },
    };
    const list = history.findOne(query, options);
    console.log(list);
  } finally {
    await client.close();
  }
  return list;
}

module.exports = { fetchHistory, fetchUserList };
