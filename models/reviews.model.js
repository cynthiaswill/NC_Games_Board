const db = require("../db/connection");

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
    const validQueries = [
        "sort_by",
        "order",
        "category",
        "limit",
        "p",
    ];
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
        [
            "title",
            "designer",
            "owner",
            "category",
            "created_at",
            "votes",
        ].includes(sort) &&
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

    const categoryResult = await db.query(
        `SELECT * FROM categories WHERE slug = $1`,
        [category]
    );
    if (category && categoryResult.rows.length === 0) {
        return Promise.reject({
            status: "404",
            msg: "Category not found",
        });
    } else {
        return rows;
    }
};

exports.insertReview = async (
    owner,
    title,
    review_body,
    designer,
    category
) => {
    const queryStr = `INSERT INTO reviews
        (owner, title, review_body, designer, category)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;`;

    const queryCategoryStr = `SELECT slug FROM categories;`;
    const queryUsernameStr = `SELECT username FROM users;`;
    const categories = await db.query(queryCategoryStr);
    const usernames = await db.query(queryUsernameStr);

    const validCategories = categories.rows.map((cat) => cat.slug);
    const validUsernames = usernames.rows.map(
        (name) => name.username
    );
    if (
        validCategories.includes(category) &&
        validUsernames.includes(owner)
    ) {
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
