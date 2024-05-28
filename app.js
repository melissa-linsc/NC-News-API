const express = require('express')
const getTopics = require('./controllers/topics-controller')

const app = express()

app.get('/api/topics', getTopics)

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else if (err.code) {
      res.status(400).send({ msg: "Bad Request" });
    }
    next();
  });
  

app.use((err, req, res, next) => {
    res.status(404).send({msg: 'Not Found'})
})

module.exports = app