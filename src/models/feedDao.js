const { DatabaseError } = require('../utils/error');
const dataSource = require('./dataSource');
const builder = require('./builder');

const getAllFeed = async (userId, feedId, targetUserId, selectedUserId, offset, limit, gender, season, style, orderBy) => {
  try {
    const baseQuery = `
      SELECT
      subq.userId,
      subq.feedId,
      subq.userName,
      subq.profileImageUrl,
      subq.feedDescription,
      subq.createdAt, 
      subq.likesCount,
      JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', subq.contentFileId,
            'contentUrl', subq.contentUrl,
            'clothesInfo', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'coordinateX', t.coordinate_x,
                        'coordinateY', t.coordinate_y,
                        'tagContent', t.contents,
                        'clothName', c.name,
                        'clothInformation', c.information,
                        'clothBuyingLink', c.buying_link,
                        'clothPrice', c.price,
                        'season', sea.seasons,
                        'style', sty.style
                      )
                  ) 
            FROM tags t
            LEFT JOIN clothes c ON t.cloth_id = c.id
            LEFT JOIN seasons sea ON c.season_id = sea.id
            LEFT JOIN styles sty ON c.style_id = sty.id
            WHERE t.content_file_id = subq.contentFileId
          )
        )
      ) AS contentUrls
        FROM (
            SELECT
                u.id AS userId,
                f.id AS feedId,
                u.user_name AS userName,
                u.profile_image_url profileImageUrl,
                f.description AS feedDescription,
                DATE_FORMAT(f.created_at, '%Y.%m.%d %H:%i:%s') AS createdAt,
                c_f.content_url AS contentUrl,
                c_f.id AS contentFileId,
                COUNT(DISTINCT l.id) likesCount
            FROM feed f
            JOIN users u ON u.id = f.user_id
            JOIN content_files c_f ON c_f.feed_id = f.id
            LEFT JOIN likes l ON l.feed_id = f.id
            LEFT JOIN tags t ON c_f.id = t.content_file_id
            LEFT JOIN clothes c ON t.cloth_id = c.id
            LEFT JOIN seasons sea ON c.season_id = sea.id
            LEFT JOIN styles sty ON c.style_id = sty.id  
        `;

    const whereCondition = builder.filterBuilder(gender, season, style, userId, feedId, targetUserId, selectedUserId);
    const sortQuery = builder.orderByBuilder(orderBy);
    const limitQuery = builder.limitBuilder(offset, limit);
    const groupByQuery = ` 
    GROUP BY 
    f.id, 
    u.user_name, 
    u.profile_image_url, 
    f.description, 
    DATE_FORMAT(f.created_at, '%Y.%m.%d %H:%i:%s'),
    c_f.content_url, 
    c_f.id
    ) AS subq 
    GROUP BY 
    subq.userId,
    subq.feedId, 
    subq.userName, 
    subq.profileImageUrl, 
    subq.feedDescription, 
    subq.createdAt,
    subq.likesCount`;

    const rooms = await dataSource.query(`${baseQuery} ${whereCondition} ${groupByQuery} ${sortQuery} ${limitQuery}`);

    return rooms;
  } catch (error) {
    console.log(error);
    throw new DatabaseError();
  }
};

const uploadFeed = async (userId, feedDescription) => {
  try {
    const resultFeed = await dataSource.query(`INSERT INTO feed (user_id, description) VALUES (?, ?)`, [userId, feedDescription]);
    const feedId = resultFeed.insertId;

    return { feedId };
  } catch (error) {
    console.log(error);
    throw new DatabaseError('CAN_NOT_UPLOAD_FEED');
  }
};

const uploadContentFile = async (feedId, contentUrl) => {
  try {
    const resultContentFile = await dataSource.query(`INSERT INTO content_files (feed_id, content_url) VALUES (?, ?)`, [feedId, contentUrl]);
    const contentFileId = resultContentFile.insertId;

    return { contentFileId };
  } catch (error) {
    throw new DatabaseError('CAN_NOT_UPLOAD_CONTENT_FILE');
  }
};

const createTag = async (contentFileId, clothName, clothPrice, tagContent, coordinateX, coordinateY, clothBuyingLink, clothInformation, styleName, seasonName) => {
  try {
    const [style] = await dataSource.query(
      `
      SELECT id FROM styles WHERE style = ?
    `,
      [styleName]
    );

    const [season] = await dataSource.query(
      `
      SELECT id FROM seasons WHERE seasons = ?
    `,
      [seasonName]
    );

    if (!style | !season) throw new Error();

    const result = await dataSource.query(
      `INSERT INTO clothes (name, price, buying_link, information, style_id, season_id) 
        VALUES (?, ?, ?, ?, ?, ?)`,
      [clothName, clothPrice, clothBuyingLink, clothInformation, style.id, season.id]
    );

    await dataSource.query(
      `INSERT INTO tags (content_file_id, cloth_id, coordinate_x, coordinate_y, contents) 
        VALUES (?, ?, ?, ?, ?)`,
      [contentFileId, result.insertId, coordinateX, coordinateY, tagContent]
    );
  } catch (error) {
    console.log(error);
    throw new DatabaseError('CAN_NOT_CREATE_TAG');
  }
};

const deleteFeed = async (userId, feedId) => {
  const queryRunner = dataSource.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();
  try {
    const feed = await getFeedById(feedId);
    if (!feed) {
      throw new Error('Post does not exist');
    }

    await queryRunner.query('DELETE t FROM tags t JOIN content_files cf ON cf.id = t.content_file_id WHERE cf.feed_id = ?', [feedId]);
    await queryRunner.query('UPDATE comments SET parents_id = NULL WHERE feed_id = ?', [feedId]);
    await queryRunner.query('DELETE FROM comments WHERE feed_id = ?', [feedId]);
    await queryRunner.query('DELETE FROM likes WHERE feed_id = ?', [feedId]);
    await queryRunner.query('DELETE FROM content_files WHERE feed_id = ?', [feedId]);
    const result = await queryRunner.query('DELETE FROM feed WHERE id = ?', [feedId]);

    if (result.affectedRows === 0) {
      throw new Error('Feed deletion failed');
    }
    await queryRunner.commitTransaction();

    return { message: 'Feed deleted successfully.' };
  } catch (error) {
    console.log(error);
    await queryRunner.rollbackTransaction();
    throw new DatabaseError('DATABASE_ERROR');
  } finally {
    await queryRunner.release();
  }
};

const getFeedById = async (feedId) => {
  const feed = await dataSource.query('SELECT * FROM feed WHERE id = ?', [feedId]);
  if (feed.length > 0) {
    return feed[0];
  }
  return null;
};

module.exports = {
  getAllFeed,
  uploadFeed,
  uploadContentFile,
  createTag,
  deleteFeed,
  getFeedById,
};
