const jwt = require('jsonwebtoken');
const userDao = require('../models/userDao');
const { BaseError } = require('./error');

const checkLogInToken = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization;
    const secretKey = process.env.SECRET_KEY;

    if (!accessToken) {
      const error = new BaseError('NEED_ACCESS_TOKEN', 401);
      return res.status(error.statusCode).json({ message: error.message });
    }

    const decoded = jwt.verify(accessToken, secretKey);

    const user = await userDao.getUserById(decoded.id);

    if (!user) {
      const error = new BaseError('INVALID_USER', 401);
      return res.status(error.statusCode).json({ message: error.message });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'INVALID_TOKEN',
    });
  }
};

const validateTokenUserUndefined = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    let user;
    if (token) {
      const payload = jwt.verify(token, process.env.SECRET_KEY);
      user = payload.id;
    }
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  checkLogInToken,
  validateTokenUserUndefined,
};
