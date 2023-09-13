const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const { upload } = require('../utils/s3');

const { checkLogInToken, validateTokenUserUndefined } = require('../utils/auth');
const feedController = require('../controllers/feedController');
const commentController = require('../controllers/commentController');
const bestController = require('../controllers/bestController');

router.get('', feedController.getAllFeed);
router.get('/best', feedController.getAllFeed);
router.get('/followings', validateTokenUserUndefined, feedController.getAllFeed);
router.get('/:feedId', feedController.getAllFeed);
router.get('/users/:targetUserId', feedController.getAllFeed);
router.get('/likes/:selectedUserId', feedController.getAllFeed);
router.get('/:feedId/comment', commentController.getCommentByFeedId);
router.post('/upload', checkLogInToken, upload.array('contentsImage'), feedController.uploadFeed);
router.delete('/:feedId', checkLogInToken, feedController.deleteFeed);

module.exports = { router };
