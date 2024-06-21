const userRouter = require('express').Router();

const {getUsers, getUserByUsername, postUser} = require('../controllers/users-controller');

userRouter.get('/', getUsers);

userRouter.get('/:username', getUserByUsername);

userRouter
.route('/')
.get(getUsers)
.post(postUser)
  
module.exports = userRouter;