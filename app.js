const express = require('express')
const getTopics = require('./controllers/topics-controller')
const getEndpoints = require('./controllers/endpoints-controller')
const {
getArticleById,
getArticles, 
getCommentsByArticleId, postCommentsByArticleId,
patchArticle
} = require('./controllers/articles.controller')
const deleteComment = require('./controllers/comments-controller')
const getUsers = require('./controllers/users-controller')

const apiRouter = require('./routes/api-router');

const app = express()

app.use(express.json())

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else if (err.code === '22P02') {
      res.status(400).send({ msg: "Invalid Input" });
    }
    next();
  });
  

app.use((err, req, res, next) => {
    res.status(404).send({msg: 'Not Found'})
})

module.exports = {app}