const db = require("../db/connection");

exports.selectCategories = async () => {
    const { rows } = await db.query(`SELECT * FROM categories;`);
    return rows;
};

exports.insertCategory = async (slug, description) => {
    const { rows } = await db.query(
        `INSERT INTO categories
        (slug, description)
        VALUES ($1, $2)
        RETURNING *`,
        [slug, description]
    );
    return rows[0];
};
