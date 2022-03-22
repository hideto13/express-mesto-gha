const bcrypt = require('bcryptjs');
const User = require('../models/user');
const { handleResponseError } = require('../utils/handleResponseError');

const getUserObj = (user) => {
  const obj = {
    _id: user._id,
    name: user.name,
    about: user.about,
    avatar: user.avatar,
    password: user.password,
    email: user.email,
  };
  return obj;
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users.map((user) => getUserObj(user))))
    .catch((err) => handleResponseError(err, res));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send(getUserObj(user)))
    .catch((err) => handleResponseError(err, res));
};

module.exports.createUser = (req, res) => {
  const {
    name, email, password, about, avatar,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash, about, avatar,
    }))
    .then((user) => res.send(getUserObj(user)))
    .catch((err) => handleResponseError(err, res));
};

module.exports.updateUser = (req, res) => {
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
      throw new Error('NotFound');
    })
    .then((user) => res.send(getUserObj(user)))
    .catch((err) => handleResponseError(err, res));
};

module.exports.updateAvatar = (req, res) => {
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
      throw new Error('NotFound');
    })
    .then((user) => res.send(getUserObj(user)))
    .catch((err) => handleResponseError(err, res));
};
