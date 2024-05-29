const deleteCommentById = require('../models/comments-model')

const deleteComment = (req, res, next) => {
    const commentId = req.params.comment_id
    deleteCommentById(commentId).then(() => {
        res.status(204).send()
    })
    .catch(next)
}

module.exports = deleteComment