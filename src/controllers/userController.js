const userService = require('../services/userService');
const { catchAsync, BaseError } = require('../utils/error');

const signInKakao = catchAsync(async (req, res) => {
  const { kakaoToken } = req.body;

  if (!kakaoToken) throw new BaseError(401, 'NEED_KAKAOTOKEN');

  const { accessToken, name } = await userService.signInKakao(kakaoToken);

  return res.status(200).json({ token: accessToken, userName: name });
});

const getUserById = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const userInfo = await userService.getUserById(userId);

  return res.status(200).json(userInfo);
});

const editUserInfo = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userName, cellphone, sex, bio } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    await userService.editUserInfo(userId, userName, cellphone, sex, bio);

    return res.status(200).json({ message: 'user info update successfully' });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Error_ editUserInfo /usersController',
    });
  }
};

const uploadImageUrl = catchAsync(async (req, res) => {
  try {
    const userId = req.user.id;
    const profileImageUrl = req.file.location;

    if (!userId) {
      return res.status(400).json({ message: 'User Not Found' });
    }

    await userService.uploadImageUrl(userId, profileImageUrl);

    return res.status(200).json({ message: 'user image upload successfully' });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      message: 'Error uploading image in uploadImageUrl',
    });
  }
});

const getOtherUser = catchAsync(async (req, res) => {
  const userId = req.params.userId;
  const userInfo = await userService.getOtherUser(userId);

  return res.status(200).json(userInfo);
});

module.exports = {
  signInKakao,
  getUserById,
  editUserInfo,
  uploadImageUrl,
  getOtherUser,
};
