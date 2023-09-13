const dataSource = require('../models/dataSource');
const { DatabaseError, BaseError } = require('../utils/error');

const getCommentByFeedId = async (feedId) => {
  try {
    return await dataSource.query(
      `
      SELECT
      c.id commentsId,
      c.contents commentContents,
      u.user_name userName,
      u.profile_image_url profileImageUrl,
      date_format(c.created_at, '%Y.%m.%d.%H.%i') createdAt
      FROM comments c
      JOIN users u ON u.id = c.user_id
      JOIN feed f ON c.feed_id = f.id
      WHERE c.feed_id = ?
      ORDER BY c.created_at
    `,
      [feedId]
    );
  } catch (error) {
    console.log(error);
    throw new DatabaseError('CAN_NOT_GET_COMMENTS');
  }
};

const addComment = async (userId, feedId, content) => {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const user = await queryRunner.query(
      `
      SELECT id FROM users WHERE id = ?
    `,
      [userId]
    );

    if (!user || user.length === 0) {
      throw new DatabaseError('USER_NOT_FOUND');
    }

    const commentId = await queryRunner.query(
      `
      INSERT INTO comments(
        user_id,
        feed_id,
        contents
      ) VALUES (?, ?, ?)
    `,
      [user[0].id, feedId, content]
    );

    const parentsId = commentId.insertId;

    await queryRunner.query(
      `
      UPDATE comments
      SET parents_id = ?
      WHERE id = ?
    `,
      [parentsId, parentsId]
    );

    await queryRunner.commitTransaction();

    return true;
  } catch (error) {
    console.log(error);
    await queryRunner.rollbackTransaction();
    throw new DatabaseError('DATASOURCE ERROR');
  } finally {
    await queryRunner.release();
  }
};

const deleteComment = async (userId, feedId, commentId) => {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const user = await queryRunner.query(
      `
      SELECT id FROM users WHERE id = ?
    `,
      [userId]
    );

    if (!user || user.length === 0) {
      throw new BaseError('USER_NOT_FOUND');
    }

    await queryRunner.query(
      `
      UPDATE comments
      SET parents_id = NULL
      WHERE parents_id = ?
    `,
      [commentId]
    );

    await queryRunner.query(
      `
      DELETE FROM comments
      WHERE user_id = ? AND feed_id = ? AND id = ?
    `,
      [user[0].id, feedId, commentId]
    );

    await queryRunner.commitTransaction();

    return await dataSource.query(
      `
      SELECT
      c.id,
      c.contents,
      u.user_name,
      u.profile_image_url,
      date_format(c.created_at, '%Y.%m.%d.%H.%i') createdAt
      FROM comments c
      JOIN users u ON u.id = c.user_id
      JOIN feed f ON c.feed_id = f.id
      WHERE c.feed_id = ?
      ORDER BY c.created_at
    `,
      [feedId]
    );
  } catch (error) {
    console.log(error);
    await queryRunner.rollbackTransaction();
    throw new DatabaseError('DATABASE_ERROR');
  } finally {
    await queryRunner.release();
  }
};

module.exports = {
  getCommentByFeedId,
  addComment,
  deleteComment,
};
