const feedDao = require('../models/feedDao');

const getAllFeed = async (userId, feedId, targetUserId, selectedUserId, offset, limit, gender, season, style, orderBy) => {
  return await feedDao.getAllFeed(userId, feedId, targetUserId, selectedUserId, offset, limit, gender, season, style, orderBy);
};

const uploadFeed = async (userId, feedDescription, contentUrls, feedInfo) => {
  const feed = await feedDao.uploadFeed(userId, feedDescription);
  const feedId = feed.feedId;
  const contentsData = [];

  contentUrls.forEach((url, index) => {
    contentsData.push({
      url: url,
      tagInfo: feedInfo[index].clothesInfo,
    });
  });

  for (const content of contentsData) {
    const contentFile = await feedDao.uploadContentFile(feedId, content.url);
    const contentFileId = contentFile.contentFileId;

    for (const tag of content.tagInfo) {
      const { style, season, clothName, clothPrice, tagContent, coordinateX, coordinateY, clothBuyingLink, clothInformation } = tag;
      await feedDao.createTag(contentFileId, clothName, clothPrice, tagContent, coordinateX, coordinateY, clothBuyingLink, clothInformation, style, season);
    }
  }
};

const deleteFeed = async (userId, feedId) => {
  const feed = await feedDao.getFeedById(feedId);
  if (!feed) {
    throw new Error('Post does not exist');
  }

  if (feed.user_id !== userId) {
    throw new Error('User does not match the post id');
  }
  await feedDao.deleteFeed(userId, feedId);
  return { message: 'Feed successfully deleted.' };
};

module.exports = {
  getAllFeed,
  uploadFeed,
  deleteFeed,
};
