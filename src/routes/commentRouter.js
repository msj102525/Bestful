const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { checkLogInToken } = require('../utils/auth');
const auth = require('../utils/auth');

router.post('', checkLogInToken, commentController.addComment);

router.patch('', checkLogInToken, commentController.deleteComment);

module.exports = { router };
