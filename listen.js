const app = require("./app");
const socket = require("socket.io");
const {
  insertIntoDB,
  get_Last_User,
  user_Disconnect,
  join_User,
} = require("./socketIO/socketUser");

const { PORT = 9000 } = process.env;
const httpServer = app.listen(PORT, () => {
  console.log(`listening on port ${PORT}...`);
});

const io = socket(httpServer, {
  cors: { origin: "*" },
});

//listener#1: initialise socket io connection
io.on("connection", (socket) => {
  //for a new user joining the room
  socket.on("joinRoom", ({ username, roomName }) => {
    //* create user
    const p_user = join_User(socket.id, username, roomName);
    console.log(socket.id, "=id");
    socket.join(p_user.roomName);
  });

  //listener#2: user sending message
  socket.on("chat", (messageBody) => {
    //gets the room user and the message sent
    const p_user = get_Last_User(socket.id);
    console.log(p_user.username, p_user.roomName, "<<<<<<<<");

    //emit sent messages using sockitIO
    io.to(p_user.roomName).emit("message", {
      userId: p_user.id,
      username: p_user.username,
      messageBody: messageBody,
    });

    // insert sent message into database
    insertIntoDB(p_user.username, p_user.roomName, messageBody).catch(console.dir);
  });

  //listener#3: when the user exits the room
  // socket.on("disconnect", async () => {
  //   //the user is deleted from array of users and a message displayed
  //   const p_user = await user_Disconnect(socket.id);
  //   console.log(p_user, "user to be disconnected");
  //   if (p_user) {
  //     io.to(p_user.roomName).emit("message", {
  //       userId: p_user.id,
  //       username: p_user.username,
  //       messageBody: `${p_user.username} has left the chat`,
  //     });
  //   }
  // });
});
