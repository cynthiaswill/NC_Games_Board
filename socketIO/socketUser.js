const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://yzhang4:123456abc@cluster0.rspyf.mongodb.net/My_test_project?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const c_users = [];
const onlineUsers = [];

const asyncUpdateUserList = async function updateUserList() {
  try {
    await client.connect();

    const database = client.db("My_test_project");
    const history = database.collection("chatHistory");

    // create a filter for a movie to update
    const filter = { title: "online users list" };

    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true };

    // create a document that sets the plot of the movie
    const updateDoc = {
      $set: {
        onlineUsers: [...onlineUsers],
      },
    };

    const result = await history.updateOne(filter, updateDoc, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );
  } finally {
    await client.close();
  }
};

// joins the user to the specific chatroom
function join_User(id, username, roomName) {
  const p_user = { id, username, roomName };

  c_users.push(p_user);

  c_users.forEach((user) => {
    if (!onlineUsers.includes(user.username)) {
      onlineUsers.push(user.username);
    }
  });
  console.log(onlineUsers, "online_users");

  asyncUpdateUserList();

  return p_user;
}

console.log("current_users", c_users);

function get_Last_User(id) {
  const matchedUsers = c_users.filter((user) => {
    return user.id === id;
  });
  const users = [...matchedUsers];
  return users[users.length - 1];
}

// called when the user leaves the chat and its user object deleted from array
function user_Disconnect(id) {
  const index = c_users.findIndex((p_user) => p_user.id === id);
  const index2 = onlineUsers.findIndex(
    (username) => username === c_users[index].username
  );
  if (index !== -1) {
    onlineUsers.splice(index2, 1);
    asyncUpdateUserList();
    console.log(index2, onlineUsers, "<<online_users");
    return c_users.splice(index, 1)[0];
  }
}

module.exports = {
  join_User,
  get_Last_User,
  user_Disconnect,
  client,
};
