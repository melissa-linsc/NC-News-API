const readEndpoints = require('../models/endpoints-model')

const getEndpoints = (req,res,next) => {
    readEndpoints().then((endpointObj) => {
        res.status(200).send({endpoints: endpointObj})
    })
    .catch(next)
}

module.exports = getEndpoints