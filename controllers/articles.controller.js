const {selectArticleById,
     selectArticles,
     selectCommentsByArticleId,
     insertCommentByArticleId
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
        if (comments.length) {
            res.status(200).send({comments})
        }
        else {
            res.status(200).send({comments: "No Comments For This Article Yet!"})
        }
    })
    .catch(next)
}

const postCommentsByArticleId = (req,res,next) => {

    const articleId = req.params.article_id
    const newComment = req.body

    if (!newComment.body || !newComment.username || Object.keys(newComment).length !==2) {
        return next({status:400, msg: 'Invalid Request Body'})
    }

    newComment.votes = 0
    newComment.article_id = articleId
    newComment.author = newComment.username
    delete newComment.username
    const newCommentValues = Object.values(newComment)
    insertCommentByArticleId(articleId, [newCommentValues]).then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next)
       
}

module.exports = {getArticleById, getArticles, getCommentsByArticleId, postCommentsByArticleId}