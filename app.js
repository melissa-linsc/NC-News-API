const express = require('express')
const getTopics = require('./controllers/topics-controller')
const getEndpoints = require('./controllers/endpoints-controller')
const getArticleById = require('./controllers/articles.controller')

const app = express()

app.get('/api/topics', getTopics)

app.get('/api', getEndpoints)

app.get('/api/articles/:article_id', getArticleById)

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else if (err.code === '22P02') {
      res.status(400).send({ msg: "Bad Request" });
    }
    next();
  });
  

app.use((err, req, res, next) => {
    res.status(404).send({msg: 'Not Found'})
})

const countEndpoints = () => {
    let count = 0
    app._router.stack.forEach((middleware) => {
        if (middleware.route) {
            count ++
        }
    })
    return count
}

countEndpoints()

module.exports = {app, countEndpoints}