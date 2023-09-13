const filterBuilder = (gender, season, style, userId, feedId, targetUserId, selectedUserId) => {
  let conditionArr = [];

  if (gender) {
    conditionArr.push(`u.sex = ${gender}`);
  }

  if (season) {
    conditionArr.push(`sea.id = ${season}`);
  }

  if (style) {
    conditionArr.push(`sty.id= ${style}`);
  }

  if (userId) {
    conditionArr.push(`f.user_id IN (
      SELECT followed_id
      FROM followers
      WHERE user_id = ${userId}
    )`);
  }

  if (feedId) {
    conditionArr.push(`f.id = ${feedId}`);
  }

  if (targetUserId) {
    conditionArr.push(`f.user_id = ${targetUserId}`);
  }

  if (selectedUserId) {
    // console.log(selectedUserId);
    conditionArr.push(`l.user_id IN (
      SELECT user_id
      FROM likes
      WHERE user_id = ${selectedUserId}
    )`);
  }

  let whereCondition = '';

  if (conditionArr.length > 0) {
    whereCondition = `WHERE ${conditionArr.join(' AND ')}`;
  }
  return whereCondition;
};

const limitBuilder = (offset, limit) => {
  if (!limit) limit = 100;

  if (!offset) offset = 0;

  return `LIMIT ${limit} OFFSET ${offset}`;
};

const orderByBuilder = (orderBy) => {
  let orderQuery = '';

  switch (orderBy) {
    case 'likesDesc':
      orderQuery = 'ORDER BY subq.likesCount DESC, subq.createdAt DESC';
      break;
    default:
      orderQuery = 'ORDER BY subq.createdAt DESC';
      break;
  }
  return orderQuery;
};

module.exports = {
  filterBuilder,
  limitBuilder,
  orderByBuilder,
};
