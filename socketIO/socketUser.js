// const { MongoClient } = require("mongodb");
// const uri =
//   "mongodb+srv://yzhang4:123456abc@cluster0.rspyf.mongodb.net/My_test_project?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// const c_users = [];

// async function insertIntoDB(user, room, message) {
//   try {
//     await client.connect();
//     const database = client.db("My_test_project");
//     const history = database.collection("chatHistory");
//     // create a document to insert
//     const doc = {
//       username: `${user}`,
//       roomName: `${room}`,
//       messageBody: `${message}`,
//       dateCreated: new Date(),
//     };
//     const result = await history.insertOne(doc);
//     console.log(`A document was inserted with the _id: ${result.insertedId} by ${user}`);
//   } finally {
//     await client.close();
//   }
// }

// const getUsersList = async () => {
//   try {
//     await client.connect();
//     const database = client.db("My_test_project");
//     const history = database.collection("chatHistory");
//     const query = { title: "online users list" };
//     const options = {
//       projection: { onlineUsers: 1 },
//     };
//     const list = await history.findOne(query, options);
//     console.log(list.onlineUsers, "online_user_list from db");
//     return list.onlineUsers;
//   } catch (error) {
//     console.dir(error);
//   }
// };

// const updateUsersList = async (onlineUsers) => {
//   try {
//     await client.connect();

//     const database = client.db("My_test_project");
//     const history = database.collection("chatHistory");

//     // create a filter for a movie to update
//     const filter = { title: "online users list" };

//     // this option instructs the method to create a document if no documents match the filter
//     const options = { upsert: true };

//     // create a document that sets the plot of the movie
//     const updateDoc = {
//       $set: {
//         onlineUsers: [...onlineUsers],
//       },
//     };

//     const result = await history.updateOne(filter, updateDoc, options);
//     console.log(
//       `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
//     );
//   } catch (error) {
//     console.dir(error);
//   }
// };

// // joins the user to the specific chatroom
// async function join_User(id, username, roomName) {
//   const p_user = { id, username, roomName };
//   const onlineUsers = await getUsersList();
//   console.log(onlineUsers, "online_users before update list");
//   c_users.push(p_user);

//   !onlineUsers.includes(username) && onlineUsers.push(username);

//   console.log(onlineUsers, "online_users after update list");

//   updateUsersList(onlineUsers);

//   return p_user;
// }

// console.log("current_users", c_users);

// function get_Last_User(id) {
//   const matchedUsers = c_users.filter((user) => {
//     return user.id === id;
//   });
//   const users = [...matchedUsers];
//   return users[users.length - 1];
// }

// // called when the user leaves the chat and its user object deleted from array
// async function user_Disconnect(id) {
//   const onlineUsers = await getUsersList();
//   const userToDelete = get_Last_User(id);
//   console.log(onlineUsers, "online_users before delete from list");

//   if (userToDelete) {
//     const index = onlineUsers.findIndex((username) => username === userToDelete.username);
//     onlineUsers.splice(index, 1);
//     updateUsersList(onlineUsers);
//     console.log(onlineUsers, "online_users after someone disconnects");
//     return userToDelete;
//   }
// }

// module.exports = {
//   join_User,
//   insertIntoDB,
//   get_Last_User,
//   user_Disconnect,
//   client,
// };

const { MongoClient } = require("mongodb");
const uri =
  "mongodb+srv://yzhang4:123456abc@cluster0.rspyf.mongodb.net/My_test_project?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const c_users = [];
const onlineUsers = [];

async function insertIntoDB(user, room, message) {
  try {
    await client.connect();
    const database = client.db("My_test_project");
    const history = database.collection("chatHistory");
    // create a document to insert
    const doc = {
      username: `${user}`,
      roomName: `${room}`,
      messageBody: `${message}`,
      dateCreated: new Date(),
    };
    const result = await history.insertOne(doc);
    console.log(`A document was inserted with the _id: ${result.insertedId} by ${user}`);
  } finally {
    await client.close();
  }
}

const updateUsersList = async () => {
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
  } catch (error) {
    console.dir(error);
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

  updateUsersList();

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
    updateUsersList();
    console.log(index2, onlineUsers, "<<online_users");
    return c_users.splice(index, 1)[0];
  }
}

module.exports = {
  join_User,
  get_Last_User,
  user_Disconnect,
  insertIntoDB,
  client,
};
