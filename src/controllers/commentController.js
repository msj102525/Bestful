const commentService = require('../services/commentService');
const { catchAsync, BaseError } = require('../utils/error');

const getCommentByFeedId = catchAsync(async (req, res) => {
  const { feedId } = req.params;

  if (!feedId) throw new BaseError(401, 'EMPTY_KEY');

  const result = await commentService.getCommentByFeedId(feedId);

  return res.status(200).json(result);
});

const addComment = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { feedId, contents } = req.body;

  if (!userId || !feedId || !contents) throw new BaseError(400, 'EMPTY_KEY');

  await commentService.addComment(userId, feedId, contents);

  return res.status(200).json({ message: 'ADD_COMMENT' });
});

const deleteComment = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const { feedId, commentId } = req.body;

  if (!userId || !feedId || !commentId) throw new BaseError(400, 'EMPTY_KEY');

  await commentService.deleteComment(userId, feedId, commentId);

  return res.status(200).json({ message: 'DELETE_COMMENT' });
});

module.exports = {
  getCommentByFeedId,
  addComment,
  deleteComment,
};
