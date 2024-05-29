const {selectUsers} = require('../models/users-model')

const getUsers = (req,res,next) => {
    selectUsers().then((userData) => {
        res.status(200).send({users: userData})
    })
}

module.exports = getUsers