const dataSource = require('./dataSource');
const { DatabaseError } = require('../utils/error');

const createLike = async (userId, feedId) => {
  try {
    const query = 'INSERT INTO likes (user_id, feed_id) VALUES (?, ?)';
    const values = [userId, feedId];
    const result = await dataSource.query(query, values);

    const createdLikeId = result.insertId;
    return { id: createdLikeId, userId, feedId };
  } catch (error) {
    throw new DatabaseError('Failed to create like in the database.', 500);
  }
};

const removeLike = async (userId, feedId) => {
  try {
    const query = 'DELETE FROM likes WHERE user_id = ? AND feed_id = ?';
    const values = [userId, feedId];
    const result = await dataSource.query(query, values);

    return { success: result.affectedRows > 0 };
  } catch (error) {
    throw new DatabaseError('Failed to delete like in the database.', 500);
  }
};

const getLike = async (userId, feedId) => {
  try {
    const query = 'SELECT * FROM likes WHERE user_id = ? AND feed_id = ?';
    const values = [userId, feedId];
    const [result] = await dataSource.query(query, values);

    return result ? { id: result.id, userId, feedId } : null;
  } catch (error) {
    throw new DatabaseError('Failed to get like from the database.', 500);
  }
};

module.exports = {
  createLike,
  removeLike,
  getLike
};
