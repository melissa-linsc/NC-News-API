const {selectUsers, selectUserByUsername, insertUsers} = require('../models/users-model')

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

const postUser = (req,res,next) => {
    const requestBody = req.body

    const newUser = {}

    newUser.username = requestBody.username
    newUser.name = requestBody.name

    const defaultImg = "https://static-00.iconduck.com/assets.00/user-avatar-happy-icon-2048x2048-ssmbv1ou.png"
    if (!requestBody.avatar_url) {
        newUser.avatar_url = defaultImg
    }
    else {
        newUser.avatar_url = requestBody.avatar_url
    }


    const values = Object.values(newUser)

    insertUsers(values, requestBody).then((newUser) => {
        res.status(200).send({newUser})
    })
    .catch(next)
}

module.exports = {getUsers, getUserByUsername, postUser}