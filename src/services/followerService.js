const followerDao = require('../models/followerDao');
const { BaseError } = require('../utils/error');

const followUser = async (userId, followedId) => {
  if (userId === followedId) {
    throw new BaseError('You cannot follow yourself.');
  }

  try {
    await followerDao.followUser(userId, followedId);
  } catch (err) {
    throw new BaseError('Failed to follow user.');
  }

  return { message: 'Successfully followed user.' };
};

const unfollowUser = async (userId, followedId) => {
  if (userId === followedId) {
    throw new BaseError('You cannot unfollow yourself.');
  }

  try {
    await followerDao.unfollowUser(userId, followedId);
  } catch (err) {
    throw new BaseError('Failed to unfollow user.');
  }

  return { message: 'Successfully unfollowed user.' };
};

const getFollowers = async (userId) => {
  try {
    const followers = await followerDao.getFollowers(userId);
    return followers;
  } catch (err) {
    console.log(err);
    throw new BaseError('Failed to retrieve followers.');
  }
};

const getFollowings = async (userId) => {
  try {
    const followings = await followerDao.getFollowings(userId);
    return followings;
  } catch (err) {
    console.log(err);
    throw new BaseError('Failed to retrieve followings.');
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowings
};
