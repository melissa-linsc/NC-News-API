const endpointRouter = require('express').Router()

const getEndpoints = require('../controllers/endpoints-controller')

endpointRouter
.route('')
.get(getEndpoints)

module.exports = endpointRouter