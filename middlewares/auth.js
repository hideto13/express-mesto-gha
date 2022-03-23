const jwt = require('jsonwebtoken');
const ForbiddenError = require('../errors/Forbidden');
const InvalidError = require('../errors/Invalid');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new ForbiddenError('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new InvalidError('Некорректный токен'));
  }

  req.user = payload;

  return next();
};
