const {selectUsers, selectUserByUsername} = require('../models/users-model')

const getUsers = (req,res,next) => {
    selectUsers().then((userData) => {
        res.status(200).send({users: userData})
    })
}

const getUserByUsername = (req,res,next) => {
    const username = req.params.username
    selectUserByUsername(username).then((user) => {
        res.status(200).send({user})
    })
    .catch(next)
}

module.exports = {getUsers, getUserByUsername}