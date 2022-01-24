const c_users = [];

// joins the user to the specific chatroom
function join_User(id, username, roomName) {
  const p_user = { id, username, roomName };

  c_users.push(p_user);
  console.log(c_users, "users");

  return p_user;
}

console.log("user out", c_users);

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

  if (index !== -1) {
    return c_users.splice(index, 1)[0];
  }
}

module.exports = {
  join_User,
  get_Last_User,
  user_Disconnect,
};
