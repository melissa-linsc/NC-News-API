const db = require("../db/connection");

const deleteCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1
    RETURNING *`, [comment_id]).then((comment) => {
        if (!comment.rows.length) {
            return Promise.reject({status: 404, msg: "Comment Not Found"})
        }
    })
}

module.exports = deleteCommentById