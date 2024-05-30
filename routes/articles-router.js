const articleRouter = require('express').Router()

const {
    getArticleById,
    getArticles, 
    getCommentsByArticleId, postCommentsByArticleId,
    patchArticle,
    postArticle,
    deleteArticle
    } = require('../controllers/articles.controller')

articleRouter
.route('/')
.get(getArticles)
.post(postArticle)

articleRouter
.route('/:article_id')
.get(getArticleById)
.patch(patchArticle)
.delete(deleteArticle)

articleRouter
.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postCommentsByArticleId)

module.exports = articleRouter