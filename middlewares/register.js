const validator = require('validator');
const InvalidError = require('../errors/Unauthorized');

module.exports = (req, res, next) => {
  const { email } = req.body;

  if (!validator.isEmail(email)) {
    next(new InvalidError('Некорректный email'));
  }
  return next();
};
