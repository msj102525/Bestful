const userDao = require('../models/userDao');
const { BaseError } = require('../utils/error');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const signInKakao = async (kakaoToken) => {
  const result = await axios.post('https://kapi.kakao.com/v2/user/me', null, {
    headers: {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${kakaoToken}`,
    },
  });

  if (result.status !== 200) {
    throw new BaseError('INVALID_KAKAO_TOKEN', 401);
  }
  const { data } = result;

  const nickname = data.properties.nickname;
  const email = data.kakao_account.email;
  const kakaoId = data.id;

  let user = await userDao.getUserByKakaoId(kakaoId);

  if (!user) {
    user = await userDao.createUser(kakaoId, nickname, email);
  }

  const payLoad = { id: user.id };

  const accessToken = jwt.sign(payLoad, process.env.SECRET_KEY);
  const name = user.nickname;
  return { accessToken: accessToken, nickname: name };
};

const getUserById = async (userId) => {
  return await userDao.getUserById(userId);
};

const editUserInfo = async (userId, userName, cellphone, sex, bio) => {
  try {
    await getUserById(userId);
    const editUserInfo = await userDao.editUserInfo(
      userId,
      userName,
      cellphone,
      sex,
      bio
    );
    return editUserInfo;
  } catch (err) {
    throw new Error("Error_ editUserInfo /usersService " + err.message);
  }
};

const uploadImageUrl = async (userId, profileImageUrl) => {
  try {
    await getUserById(userId);
    const uploadImageResult = await userDao.uploadImageUrl(userId, profileImageUrl);
    return uploadImageResult;
  } catch (err) {
    throw new Error("Error uploading image in uploadImageUrl: " + err.message);
  }
};

const getOtherUser = async (userId) => {
  return await userDao.getOtherUser(userId);
};

module.exports = {
  signInKakao,
  getUserById,
  editUserInfo,
  uploadImageUrl,
  getOtherUser
};
