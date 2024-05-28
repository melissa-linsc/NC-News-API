const {selectArticleById,
     selectArticles,
     selectCommentsByArticleId
    }= require('../models/articles-model')

const getArticleById = (req,res,next) => {
    const articleId = req.params.article_id
    selectArticleById(articleId).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

const getArticles = (req,res,next) => {
    selectArticles().then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}

const getCommentsByArticleId = (req,res,next) => {
    const articleId = req.params.article_id
    selectCommentsByArticleId(articleId).then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}

module.exports = {getArticleById, getArticles, getCommentsByArticleId}