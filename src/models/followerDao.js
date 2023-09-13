const dataSource = require('./dataSource');
const { DatabaseError } = require('../utils/error');

const followUser = async (userId, followedId) => {
  try {
    await dataSource.query(
      `
    INSERT INTO followers (user_id, followed_id)
    VALUES (?, ?)
    `,
      [userId, followedId]
    );
  } catch (err) {
    throw new DatabaseError('DataSource_Error');
  }
};

const unfollowUser = async (userId, followedId) => {
  try {
    await dataSource.query(
      `
    DELETE FROM followers
    WHERE user_id = ? AND followed_id = ?
    `,
      [userId, followedId]
    );
  } catch (err) {
    throw new DatabaseError('DataSource_Error');
  }
};

const getFollowers = async (userId) => {
  try {
    const query = `
      SELECT
        users.id,
        users.kakao_id,
        users.email,
        users.user_name userName,
        users.cellphone,
        users.profile_image_url profileImage,
        users.sex,
        users.bio,
        users.created_at,
        users.updated_at,
        users.deleted_at
      FROM users
      JOIN followers ON followers.followed_id = users.id
      WHERE followers.user_id = ?
    `;
    const rows = await dataSource.query(query, [userId]);

    // Return the followers directly without converting to JSON
    return rows;
  } catch (err) {
    console.log(err);
    throw new DatabaseError('DataSource_Error: ' + err.message);
  }
};

const getFollowings = async (userId) => {
  try {
    const query = `
      SELECT
        users.id,
        users.email,
        users.user_name userName,
        users.cellphone,
        users.profile_image_url profileImage,
        users.sex,
        users.bio,
        users.created_at,
        users.updated_at,
        users.deleted_at
      FROM users
      JOIN followers ON followers.user_id = users.id
      WHERE followers.followed_id = ?
    `;
    const rows = await dataSource.query(query, userId);

    // Return the followings directly without converting to JSON
    return rows;
  } catch (err) {
    console.log(err);
    throw new DatabaseError('DataSource_Error: ' + err.message);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getFollowers,
  getFollowings,
};
