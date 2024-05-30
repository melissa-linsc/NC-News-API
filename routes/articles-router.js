const articleRouter = require('express').Router()

const {
    getArticleById,
    getArticles, 
    getCommentsByArticleId, postCommentsByArticleId,
    patchArticle,
    postArticle
    } = require('../controllers/articles.controller')

articleRouter
.route('/')
.get(getArticles)
.post(postArticle)

articleRouter
.route('/:article_id')
.get(getArticleById)
.patch(patchArticle)

articleRouter
.route('/:article_id/comments')
.get(getCommentsByArticleId)
.post(postCommentsByArticleId)

module.exports = articleRouter