const express = require('express');
const { checkLogInToken } = require('../utils/auth');
const followerController = require('../controllers/followerController');

const router = express.Router();

router.post('/', checkLogInToken, followerController.followUser);
router.delete('/', checkLogInToken, followerController.unfollowUser);
router.get('/:userId', followerController.getFollowers);
router.get('/following/:userId', followerController.getFollowings);

module.exports = { router };
