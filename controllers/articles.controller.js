const {
    selectArticleById,
    selectArticles,
    selectCommentsByArticleId,
    insertCommentByArticleId,
    updateArticle,
    insertArticle,
    deleteArticleById
    }= require('../models/articles-model')

const getArticleById = (req,res,next) => {
    const articleId = req.params.article_id
    selectArticleById(articleId).then((article) => {
        res.status(200).send({article})
    })
    .catch(next)
}

const getArticles = (req,res,next) => {

    const topic = req.query.topic
    const sortBy = req.query.sort_by
    const order = req.query.order
    const limit = req.query.limit
    const page = req.query.p

    selectArticles(topic, sortBy, order, limit, page).then((articles) => {
        const length = articles.length
        res.status(200).send({articles:  articles, total_count: length})
    })
    .catch(next)
}

const getCommentsByArticleId = (req,res,next) => {
    const limit = req.query.limit
    const articleId = req.params.article_id
    const page = req.query.p

    selectCommentsByArticleId(articleId, limit, page).then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}

const postCommentsByArticleId = (req,res,next) => {

    const articleId = req.params.article_id

    const newComment = {}

    newComment.body = req.body.body
    newComment.votes = 0
    newComment.article_id = articleId
    newComment.author = req.body.username
    delete newComment.username
    const newCommentValues = Object.values(newComment)
    insertCommentByArticleId(articleId, [newCommentValues], newComment).then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)   
}

const patchArticle = (req,res,next) => {
    const articleId = req.params.article_id

    const requestBody = req.body
    
    const updatedVotes =requestBody.inc_votes
    
    updateArticle(articleId, updatedVotes, requestBody).then((article) => {
        res.status(200).send({updatedArticle: article})
    })
    .catch(next)
}

const postArticle = (req,res,next) => {
    const requestBody = req.body

    const newArticle = {}

    newArticle.author = requestBody.author
    newArticle.title = requestBody.title
    newArticle.body = requestBody.body
    newArticle.topic = requestBody.topic

    const defaultImg = "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700"
    if (!requestBody.article_img_url) {
        newArticle.article_img_url = defaultImg
    }
    else {
        newArticle.article_img_url = requestBody.article_img_url
    }

    newArticle.votes = 0

    const values = Object.values(newArticle)

    insertArticle([values], requestBody).then((newArticle) => {
        newArticle.comment_count = 0
        res.status(200).send({newArticle})
    })
    .catch(next)
}

const deleteArticle = (req,res,next) => {
    const articleId = req.params.article_id

    deleteArticleById(articleId).then(() => {
        res.status(204).send()
    })
    .catch(next)
}

module.exports = {
    getArticleById, 
    getArticles, 
    getCommentsByArticleId, postCommentsByArticleId,
    patchArticle,
    postArticle,
    deleteArticle
}