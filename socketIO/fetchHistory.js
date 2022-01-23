const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://yzhang4:123456abc@cluster0.rspyf.mongodb.net/My_test_project?retryWrites=true&w=majority";
const client = new MongoClient(uri);

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
      projection: { _id: 0, username: 1, messageBody: 1, dateCreated: 1 },
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

module.exports = { fetchHistory };
