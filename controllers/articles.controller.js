const selectArticleById = require('../models/articles-model')

const getArticleById = (req,res,next) => {
    const articleId = req.params.article_id
    selectArticleById(articleId).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

module.exports = getArticleById