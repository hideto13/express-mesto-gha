const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');
const register = require('../middlewares/register');

router.get('/', getUsers);

router.get('/:userId', getUser);

router.post('/', register, createUser);

router.patch('/me', updateUser);

router.patch('/me/avatar', updateAvatar);

module.exports = router;
