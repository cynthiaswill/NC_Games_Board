const db = require("../db/connection");

exports.selectUsers = async () => {
    const { rows } = await db.query(
        `SELECT users.username FROM users;`
    );
    return rows;
};

exports.selectUser = async (username) => {
    const { rows } = await db.query(
        `SELECT users.username, users.avatar_url, users.name
            FROM users WHERE username = $1`,
        [username]
    );
    if (rows.length !== 0) {
        return rows[0];
    } else if (/[^\w]/.test(username)) {
        return Promise.reject({
            status: "400",
            msg: "Invalid username!",
        });
    } else {
        return Promise.reject({
            status: "404",
            msg: "Username not found!",
        });
    }
};

const urlRegex =
    /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;

exports.insertUser = async (username, name, url) => {
    const usernames = await db.query(`SELECT username FROM users;`);
    const existedUsernames = usernames.rows.map(
        (name) => name.username
    );
    if (existedUsernames.includes(username)) {
        return Promise.reject({
            status: 400,
            msg: "This username already exist!",
        });
    } else if (!username || !name) {
        return Promise.reject({
            status: 400,
            msg: "Missing required field(s)!",
        });
    } else if (!urlRegex.test(url) && url) {
        return Promise.reject({
            status: 400,
            msg: "Invalid URL format!",
        });
    }

    const queryStr = `INSERT INTO users (username, name, avatar_url) 
        VALUES ($1, $2, $3) RETURNING *;`;

    const { rows } = await db.query(queryStr, [username, name, url]);
    return rows[0];
};

exports.updateUser = async (id, name, url) => {
    let queryStr = `UPDATE users SET `;
    let queryValues = [id];
    if (name && url) {
        queryStr += `name = $2, 
            avatar_url = $3 `;
        queryValues.push(name, url);
    } else if (name && !url) {
        queryStr += `name = $2 `;
        queryValues.push(name);
    } else if (!name && url) {
        queryStr += `avatar_url = $2 `;
        queryValues.push(url);
    } else if (!urlRegex.test(url) && url) {
        return Promise.reject({
            status: 400,
            msg: "Invalid URL format!",
        });
    } else {
        return Promise.reject({
            status: "400",
            msg: "Bad request or invalid input",
        });
    }
    queryStr += `WHERE username = $1 RETURNING *;`;
    const { rows } = await db.query(queryStr, queryValues);
    if (rows.length !== 0) {
        return rows[0];
    } else {
        return Promise.reject({
            status: "404",
            msg: "This user does not exist!",
        });
    }
};
