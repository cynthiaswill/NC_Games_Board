const db = require('../db/connection');

exports.selectUsers = async () => {
    const { rows } = await db
        .query(`SELECT users.username FROM users;`)
    return rows;
}

exports.selectUser = async (username) => {
    const { rows } = await db
        .query(`SELECT users.username, users.avatar_url, users.name
            FROM users WHERE username = $1`, [username]);
    if (rows.length !== 0) {
        return rows[0];
    }   
    else if (/[^\w]/.test(username) ) {
        return Promise.reject({ 
            status: '400', 
            msg: 'Invalid username!'
        })
    }   else {
        return Promise.reject({ 
            status: '404', 
            msg: 'Username not found!'
        })
    }
}
