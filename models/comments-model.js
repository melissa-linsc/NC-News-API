const db = require("../db/connection");

const deleteCommentById = (comment_id) => {
    return db.query(`DELETE FROM comments WHERE comment_id = $1
    RETURNING *`, [comment_id]).then((comment) => {
        if (!comment.rows.length) {
            return Promise.reject({status: 404, msg: "Comment Not Found"})
        }
    })
}

const updateCommentVotes = (newVotes, comment_id, requestBody) => {
    if (!requestBody.inc_votes || isNaN(requestBody.inc_votes)) {
        return Promise.reject({status: 400, msg: "Invalid Request Body"})
    }

    return db.query(`UPDATE comments 
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *`, [newVotes, comment_id]).then((res) => {
        if (!res.rows.length) {
            return Promise.reject({status: 404, msg: "Comment Not Found"})
        }
        else {
            return res.rows[0]
        }
    })
}

module.exports = {deleteCommentById, updateCommentVotes}