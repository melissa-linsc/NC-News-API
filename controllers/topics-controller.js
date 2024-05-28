const selectTopics = require('../models/topics-model')

const getTopics = (req,res,next) => {
    selectTopics().then((topicData) => {
        res.status(200).send({topics: topicData})
    })
    .catch(next)
}

module.exports = getTopics