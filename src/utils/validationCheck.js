const userDao = require('../models/userDao');

const validateUserName = async (userName) => {
  const specialCharacters = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '-', '+', '=', ';', ':', '\'', '"', '<', '>', ',', '.', '/'];
  const badWords = ['씨발', '새끼'];

  if (userName.length < 2 || userName.length > 10) {
    return false;
  }

  const hasSpecialCharacters = specialCharacters.some((char) =>
    userName.includes(char)
  );
  if (hasSpecialCharacters) {
    return false;
  }

  const isExistingName = await userDao.checkUserNameExists(userName);
  if (isExistingName) {
    return false;
  }

  const hasBadWords = badWords.some((word) =>
    userName.includes(word)
  );
  if (hasBadWords) {
    return false;
  }

  return true; // Validation successful
};

module.exports = { validateUserName };
