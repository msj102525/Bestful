const commentDao = require('../models/commentDao');

const getCommentByFeedId = async (feedId) => {
  return await commentDao.getCommentByFeedId(feedId);
};

const addComment = async (userId, feedId, contents) => {
  return await commentDao.addComment(userId, feedId, contents);
};

const deleteComment = async (userId, feedId, commentId) => {
  return await commentDao.deleteComment(userId, feedId, commentId);
};

module.exports = {
  getCommentByFeedId,
  addComment,
  deleteComment,
};
