const express = require('express');
const router = express.Router();

const userRouter = require('./userRouter');
const feedRouter = require('./feedRouter');
const commentRouter = require('./commentRouter');
const followerRouter = require('./followerRouter');
const bestRouter = require('./bestRouter');
const likeRouter = require('./likeRouter');

router.use('/users', userRouter.router);
router.use('/feeds', feedRouter.router);
router.use('/comment', commentRouter.router);
router.use('/follower', followerRouter.router);
router.use('/likes', likeRouter.router);

module.exports = router;
