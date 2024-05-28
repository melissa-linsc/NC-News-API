const {selectArticleById, selectArticles}= require('../models/articles-model')

const getArticleById = (req,res,next) => {
    const articleId = req.params.article_id
    selectArticleById(articleId).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

const getArticles = (req,res,next) => {
    selectArticles().then((articles) => {
        console.log(articles);
        res.status(200).send({articles})
    })
    .catch(next)
}

module.exports = {getArticleById, getArticles}