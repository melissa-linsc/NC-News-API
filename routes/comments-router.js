const commentRouter = require('express').Router()

const deleteComment = require('../controllers/comments-controller')

commentRouter
.route('/:comment_id')
.delete(deleteComment)

module.exports = commentRouter