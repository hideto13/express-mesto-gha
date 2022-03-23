const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFound');

// const { handleResponseError } = require('../utils/handleResponseError');

const getUserObj = (user) => {
  const obj = {
    _id: user._id,
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    email: user.email,
  };
  return obj;
};

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users.map((user) => getUserObj(user))))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('ID не найден');
    })
    .then((user) => res.send(getUserObj(user)))
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('ID не найден');
    })
    .then((user) => res.send(getUserObj(user)))
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash, about, avatar,
    }))
    .then((user) => res.send(getUserObj(user)))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const {
    name, about, email, password,
  } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    {
      name, about, email, password,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('ID не найден');
    })
    .then((user) => res.send(getUserObj(user)))
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFoundError('ID не найден');
    })
    .then((user) => res.send(getUserObj(user)))
    .catch(next);
};
