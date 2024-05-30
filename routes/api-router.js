const apiRouter = require('express').Router();
const userRouter = require('./users-router');
const topicRouter = require('./topics-router')
const commentRouter = require('./comments-router');
const articleRouter = require('./articles-router')
const endpointRouter = require('./endpoints-router')

apiRouter.use('/users', userRouter);

apiRouter.use('/topics', topicRouter);

apiRouter.use('/comments', commentRouter)

apiRouter.use('/articles', articleRouter)

apiRouter.use('', endpointRouter)

module.exports = apiRouter;