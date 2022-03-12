const db = require("../db/connection");
const { client } = require("../socketIO/socketUser");

exports.selectReviewById = async (id) => {
  if (!/[^\d]/.test(id)) {
    const queryStr = `SELECT reviews.*,
        COUNT(comments.review_id)::INT AS comment_count FROM reviews 
        LEFT JOIN comments ON reviews.review_id = comments.review_id 
        WHERE reviews.review_id = $1 
        GROUP BY reviews.review_id;`;
    const { rows } = await db.query(queryStr, [id]);
    if (rows.length !== 0) {
      return rows[0];
    } else {
      return Promise.reject({
        status: "404",
        msg: "This review does not exist!",
      });
    }
  } else {
    const queryStr = `SELECT reviews.*,
            COUNT(comments.review_id)::INT AS comment_count FROM reviews
            LEFT JOIN comments ON reviews.review_id = comments.review_id
            WHERE reviews.title = $1
            GROUP BY reviews.review_id;`;
    const { rows } = await db.query(queryStr, [id]);
    if (rows.length !== 0) {
      return rows[0];
    } else {
      return Promise.reject({
        status: "404",
        msg: "This review does not exist or no such title!",
      });
    }
  }
};

exports.updateReview = async (id, vote, body) => {
  let queryStr = `UPDATE reviews SET `;
  let queryValues = [id];
  if (vote && body) {
    queryStr += `votes = votes + $2, 
            review_body = $3 `;
    queryValues.push(vote, body);
  } else if (vote && !body) {
    queryStr += `votes = votes + $2 `;
    queryValues.push(vote);
  } else if (!vote && body) {
    queryStr += `review_body = $2 `;
    queryValues.push(body);
  } else {
    return Promise.reject({
      status: "400",
      msg: "Bad request or invalid input",
    });
  }
  queryStr += `WHERE review_id = $1 RETURNING *;`;
  const { rows } = await db.query(queryStr, queryValues);
  if (rows.length !== 0) {
    return rows[0];
  } else {
    return Promise.reject({
      status: "404",
      msg: "This review does not exist!",
    });
  }
};

exports.selectReviews = async (
  sort = "created_at",
  order = "desc",
  category,
  limit = 10,
  p = 1,
  queryKeys
) => {
  const validQueries = ["sort_by", "order", "category", "limit", "p"];
  if (!queryKeys.every((key) => validQueries.includes(key))) {
    return Promise.reject({
      status: "400",
      msg: "Invalid: not a query",
    });
  }
  const offset = (p - 1) * limit;
  const queryValues = [limit, offset];
  let queryStr = `SELECT reviews.*,
    COUNT(comments.review_id)::INT AS comment_count, 
    COUNT(*) OVER()::INT AS total_count 
    FROM reviews 
    LEFT JOIN comments ON reviews.review_id = comments.review_id `;
  if (category) {
    queryValues.push(category);
    queryStr += ` WHERE category = $3`;
  }
  queryStr += ` GROUP BY reviews.review_id`;

  if (
    ["title", "designer", "owner", "category", "created_at", "votes"].includes(sort) &&
    ["ASC", "asc", "desc", "DESC"].includes(order)
  ) {
    queryStr += ` ORDER BY ${sort} ${order}`;
  } else {
    return Promise.reject({
      status: "400",
      msg: "No such column in database or invalid order type",
    });
  }
  queryStr += ` LIMIT $1 OFFSET $2`;

  const { rows } = await db.query(queryStr, queryValues);

  const categoryResult = await db.query(`SELECT * FROM categories WHERE slug = $1`, [
    category,
  ]);
  if (category && categoryResult.rows.length === 0) {
    return Promise.reject({
      status: "404",
      msg: "Category not found",
    });
  } else {
    return rows;
  }
};

exports.insertReview = async (owner, title, review_body, designer, category) => {
  const queryStr = `INSERT INTO reviews
        (owner, title, review_body, designer, category)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`;

  const queryCategoryStr = `SELECT slug FROM categories;`;
  const queryUsernameStr = `SELECT username FROM users;`;
  const categories = await db.query(queryCategoryStr);
  const usernames = await db.query(queryUsernameStr);

  const validCategories = categories.rows.map((cat) => cat.slug);
  const validUsernames = usernames.rows.map((name) => name.username);
  if (validCategories.includes(category) && validUsernames.includes(owner)) {
    const { rows } = await db.query(queryStr, [
      owner,
      title,
      review_body,
      designer,
      category,
    ]);
    return rows[0];
  } else {
    return Promise.reject({
      status: "404",
      msg: "No such category or username",
    });
  }
};

exports.removeReview = async (id) => {
  const { rows } = await db.query(
    `DELETE FROM reviews WHERE review_id = $1 RETURNING *;`,
    [id]
  );
  if (rows.length !== 0) {
    return rows[0];
  } else {
    return Promise.reject({
      status: "404",
      msg: "This review_id does not exist!",
    });
  }
};

exports.getReviewSubsById = async (id) => {
  try {
    await client.connect();
    const database = client.db("My_test_project");
    const subscriptions = database.collection("subscriptions");
    const query = { review_id: `${id}` };
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

exports.subscribeReviewById = async (id, username) => {
  try {
    await client.connect();

    const database = client.db("My_test_project");
    const subscriptions = database.collection("subscriptions");
    const filter = { review_id: `${id}` };
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

exports.unsubscribeReviewById = async (id, username) => {
  try {
    await client.connect();

    const database = client.db("My_test_project");
    const subscriptions = database.collection("subscriptions");
    const filter = { review_id: `${id}` };
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

exports.getWatchedListByReviewId = async (id) => {
  try {
    await client.connect();
    const database = client.db("My_test_project");
    const subscriptions = database.collection("subscriptions");
    const query = { review_id: `${id}` };
    const options = {
      projection: { watchedUsers: 1 },
    };
    const list = await subscriptions.findOne(query, options);
    if (list && list.watchedUsers) {
      console.log(list.watchedUsers, "watched_user_list from db");
      return list.watchedUsers;
    } else {
      return [];
    }
  } catch (error) {
    console.dir(error);
  }
};

exports.watchById = async (id, username) => {
  try {
    await client.connect();

    const database = client.db("My_test_project");

    // insert subscribed users into review's collection
    const subscriptions = database.collection("subscriptions");
    const filter = { review_id: `${id}` };
    // this option instructs the method to create a document if no documents match the filter
    const list = await subscriptions.findOne(filter, { projection: { watchedUsers: 1 } });

    const options = { upsert: true };
    const updateDoc = {
      $set: {
        watchedUsers:
          list && list.watchedUsers ? [...list.watchedUsers, username] : [username],
      },
    };
    const result = await subscriptions.updateOne(filter, updateDoc, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );

    // insert subscribed reviews into user's collection
    const subscriptions2 = database.collection("users");
    const filter2 = { username: `${username}` };
    const list2 = await subscriptions2.findOne(filter2, {
      projection: { watchedReviews: 1 },
    });
    const updateDoc2 = {
      $set: {
        watchedReviews:
          list2 && list2.watchedReviews ? [...list2.watchedReviews, id] : [id],
      },
    };
    const result2 = await subscriptions2.updateOne(filter2, updateDoc2, options);
    console.log(
      `${result2.matchedCount} document(s) matched the filter2, updated ${result2.modifiedCount} document(s)`
    );

    return {
      watchedUsers:
        list && list.watchedUsers ? [...list.watchedUsers, username] : [username],
      watchedReviews:
        list2 && list2.watchedReviews ? [...list2.watchedReviews, id] : [id],
    };
  } catch (error) {
    console.dir(error);
  }
};

exports.unwatchById = async (id, username) => {
  try {
    await client.connect();

    const database = client.db("My_test_project");

    // remove unsubscribed user from review's collection
    const subscriptions = database.collection("subscriptions");
    const filter = { review_id: `${id}` };
    // this option instructs the method to create a document if no documents match the filter
    const list = await subscriptions.findOne(filter, { projection: { watchedUsers: 1 } });

    const options = { upsert: true };
    const updatedUsers =
      list && list.watchedUsers
        ? list.watchedUsers.filter((name) => name !== username)
        : [];
    const updateDoc = {
      $set: {
        watchedUsers: [...updatedUsers],
      },
    };
    const result = await subscriptions.updateOne(filter, updateDoc, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
    );

    // remove unsubscribed review from user's collection
    const subscriptions2 = database.collection("users");
    const filter2 = { username: `${username}` };
    const list2 = await subscriptions2.findOne(filter2, {
      projection: { watchedReviews: 1 },
    });
    const updatedReviews =
      list2 && list2.watchedReviews
        ? list2.watchedReviews.filter((review_id) => review_id !== id)
        : [];
    const updateDoc2 = {
      $set: {
        watchedReviews: [...updatedReviews],
      },
    };
    const result2 = await subscriptions2.updateOne(filter2, updateDoc2, options);
    console.log(
      `${result2.matchedCount} document(s) matched the filter2, updated ${result2.modifiedCount} document(s)`
    );

    return {
      watchedUsers: [...updatedUsers],
      watchedReviews: [...updatedReviews],
    };
  } catch (error) {
    console.dir(error);
  }
};
