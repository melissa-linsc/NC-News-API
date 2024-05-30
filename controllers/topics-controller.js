const {selectTopics, insertTopic} = require('../models/topics-model')

const getTopics = (req,res,next) => {
    selectTopics().then((topicData) => {
        res.status(200).send({topics: topicData})
    })
    .catch(next)
}

const postTopic = (req,res,next) => {
    
    const requestBody = req.body
    const newTopic = {}
    newTopic.slug = requestBody.slug
    newTopic.description = requestBody.description

    const values = Object.values(newTopic)

    insertTopic([values], requestBody).then((newTopic) => {
        res.status(200).send({newTopic})
    })
    .catch(next)
}

module.exports = {getTopics, postTopic}