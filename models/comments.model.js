const db = require("../db/connection");
const { client } = require("../socketIO/socketUser");

exports.selectComments = async (id, limit = 10, p = 1, queryKeys) => {
  const validQueries = ["limit", "p"];
  if (!queryKeys.every((key) => validQueries.includes(key))) {
    return Promise.reject({
      status: "400",
      msg: "Invalid: not a query",
    });
  }
  const offset = (p - 1) * limit;
  const queryStr = `SELECT 
        comments.comment_id, 
        comments.votes, 
        comments.created_at, 
        comments.author, 
        comments.body 
        FROM comments 
        LEFT JOIN users ON comments.author = users.username 
        WHERE comments.review_id = $1 
        ORDER BY created_at DESC 
        LIMIT $2 OFFSET $3`;
  const { rows } = await db.query(queryStr, [id, limit, offset]);
  const reviewResult = await db.query(`SELECT * FROM reviews WHERE review_id = $1`, [id]);

  if (reviewResult.rows.length === 0) {
    return Promise.reject({
      status: "404",
      msg: "This review_id does not exist!",
    });
  } else {
    return rows;
  }
};

exports.insertComment = async (id, name, body) => {
  const queryStr = `INSERT INTO comments 
        (body, author, review_id)
        VALUES ($1, $2, $3)
        RETURNING *;`;

  if (name === undefined || body === undefined) {
    return Promise.reject({
      status: "400",
      msg: "Invalid post request body",
    });
  } else if (name === null || body === null) {
    return Promise.reject({
      status: "400",
      msg: "Username or post body cannot be null!",
    });
  } else {
    const { rows } = await db.query(queryStr, [body, name, id]);
    return rows[0];
  }
};

exports.removeComment = async (id) => {
  const { rows } = await db.query(
    `DELETE FROM comments WHERE comment_id = $1 RETURNING *;`,
    [id]
  );
  if (rows.length !== 0) {
    return rows[0];
  } else {
    return Promise.reject({
      status: "404",
      msg: "This comment_id does not exist!",
    });
  }
};

exports.updateComment = async (id, vote, body) => {
  let queryStr = `UPDATE comments SET `;
  let queryValues = [id];
  if (vote && body) {
    queryStr += `votes = votes + $2, 
            body = $3 `;
    queryValues.push(vote, body);
  } else if (vote && !body) {
    queryStr += `votes = votes + $2 `;
    queryValues.push(vote);
  } else if (!vote && body) {
    queryStr += `body = $2 `;
    queryValues.push(body);
  } else {
    return Promise.reject({
      status: "400",
      msg: "Bad request or invalid input",
    });
  }
  queryStr += `WHERE comment_id = $1 RETURNING *;`;

  const { rows } = await db.query(queryStr, queryValues);
  if (rows.length !== 0) {
    return rows[0];
  } else {
    return Promise.reject({
      status: "404",
      msg: "This comment_id does not exist!",
    });
  }
};

exports.getCommentSubsById = async (id) => {
  try {
    await client.connect();
    const database = client.db("My_test_project");
    const subscriptions = database.collection("comments");
    const query = { comment_id: `${id}` };
    const options = {
      projection: { votedUsers: 1 },
    };
    const list = await subscriptions.findOne(query, options);
    if (list && list.votedUsers) {
      console.log(list.votedUsers, "voted_user_list from db");
      return list.votedUsers;
    } else {
      return [];
    }
  } catch (error) {
    console.dir(error);
  }
};

exports.subscribeCommentById = async (id, username) => {
  try {
    await client.connect();

    const database = client.db("My_test_project");
    const subscriptions = database.collection("comments");
    const filter = { comment_id: `${id}` };
    // this option instructs the method to create a document if no documents match the filter
    const list = await subscriptions.findOne(filter, { projection: { votedUsers: 1 } });

    const options = { upsert: true };
    const updateDoc = {
      $set: {
        votedUsers: list && list.votedUsers ? [...list.votedUsers, username] : [username],
      },
    };
    const result = await subscriptions.updateOne(filter, updateDoc, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );
    return {
      votedUsers: list && list.votedUsers ? [...list.votedUsers, username] : [username],
    };
  } catch (error) {
    console.dir(error);
  }
};

exports.unsubscribeCommentById = async (id, username) => {
  try {
    await client.connect();

    const database = client.db("My_test_project");
    const subscriptions = database.collection("comments");
    const filter = { comment_id: `${id}` };
    // this option instructs the method to create a document if no documents match the filter
    const list = await subscriptions.findOne(filter, { projection: { votedUsers: 1 } });

    const options = { upsert: true };
    const updatedUsers =
      list && list.votedUsers ? list.votedUsers.filter((name) => name !== username) : [];
    const updateDoc = {
      $set: {
        votedUsers: [...updatedUsers],
      },
    };
    const result = await subscriptions.updateOne(filter, updateDoc, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );
    return {
      votedUsers: [...updatedUsers],
    };
  } catch (error) {
    console.dir(error);
  }
};
