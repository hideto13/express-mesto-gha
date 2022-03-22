const validator = require('validator');

module.exports = (req, res, next) => {
  const { email } = req.body;

  if (!validator.isEmail(email)) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  return next();
};
