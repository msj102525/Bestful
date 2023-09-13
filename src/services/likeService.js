const likeDao = require('../models/likeDao');
const { BaseError } = require('../utils/error');

const createLike = async (userId, feedId) => {
  try {
    const like = await likeDao.createLike(userId, feedId);
    return like;
  } catch (error) {
    throw new BaseError('Failed to create like.', 500);
  }
};

const removeLike = async (userId, feedId) => {
  try {
    const like = await likeDao.removeLike(userId, feedId);
    return like;
  } catch (error) {
    throw new BaseError('Failed to remove like.', 500);
  }
};

const getLike = async (userId, feedId) => {
  try {
    const like = await likeDao.getLike(userId, feedId);
    return like;
  } catch (error) {
    throw new BaseError('Failed to get like.', 500);
  }
};

module.exports = {
  createLike,
  removeLike,
  getLike
};