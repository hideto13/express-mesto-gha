const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ERROR_CODE_BAD_REQUEST, ERROR_CODE_DEFAULT, ERROR_CODE_CONFLICT } = require('./utils/constants');
const register = require('./middlewares/register');
const auth = require('./middlewares/auth');
const {
  createUser,
  login,
} = require('./controllers/users');
const NotFoundError = require('./errors/NotFound');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signup', register, createUser);

app.post('/signin', login);

app.use('/users', auth, require('./routes/users'));

app.use('/cards', auth, require('./routes/cards'));

app.use((req, res, next) => {
  next(new NotFoundError('Некорректный запрос'));
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = ERROR_CODE_DEFAULT, message } = err;

  if (err.name === 'ValidationError') {
    return res.status(ERROR_CODE_BAD_REQUEST).send({
      message: 'Некорректно введены данные',
    });
  }
  if (err.name === 'CastError') {
    return res.status(ERROR_CODE_BAD_REQUEST).send({
      message: 'Некорректно введен ID',
    });
  }
  if (err.code === 11000) {
    return res.status(ERROR_CODE_CONFLICT).send({
      message: 'Пользователь с таким email уже зарегистрирован',
    });
  }
  return res
    .status(statusCode)
    .send({
      message: message || 'На сервере произошла ошибка',
    });
});

app.listen(PORT);
