const spicedPg = require("spiced-pg");

let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPass } = require("./secrets.json");
    db = spicedPg(`postgres:${dbUser}:${dbPass}@localhost:5432/imgboard`);
}

exports.addImg = () => {
    return db.query(`
        SELECT * FROM images
        ORDER BY id DESC;
    `);
};

exports.addNewImg = (url, username, title, description) => {
    return db.query(
        `
        INSERT INTO images (url, username, title, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `,
        [url, username, title, description]
    );
};

exports.getImageInfo = (id) => {
    return db.query(
        `
        SELECT * FROM images WHERE id = $1 
        `,
        [id]
    );
};

exports.getImageComments = (id) => {
    return db.query(
        `
        SELECT 
            * 
        FROM comments
        WHERE image_id = $1 
        ORDER BY id DESC;
        `,
        [id]
    );
};

exports.addComment = (imageId, username, comment) => {
    return db.query(
        `
        INSERT INTO comments (image_id, username, comment)
        VALUES($1,$2,$3) RETURNING *;
        `,
        [imageId, username, comment]
    );
};
