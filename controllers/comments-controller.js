const {deleteCommentById, updateCommentVotes} = require('../models/comments-model')

const deleteComment = (req, res, next) => {
    const commentId = req.params.comment_id
    deleteCommentById(commentId).then(() => {
        res.status(204).send()
    })
    .catch(next)
}

const patchComment = (req,res,next) => {
    const commentId = req.params.comment_id
    const newVotes = req.body.inc_votes
    const requestBody = req.body
    
    updateCommentVotes(newVotes, commentId, requestBody).then((updatedComment) => {
        res.status(200).send({updatedComment})
    })
    .catch(next)
}

module.exports = {deleteComment, patchComment}