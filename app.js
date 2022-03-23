const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ERROR_CODE_INVALID_DATA, ERROR_CODE_DEFAULT } = require('./utils/constants');
const register = require('./middlewares/register');
const auth = require('./middlewares/auth');
const {
  createUser,
  login,
} = require('./controllers/users');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signup', register, createUser);

app.post('/signin', login);

app.use('/users', auth, require('./routes/users'));

app.use('/cards', auth, require('./routes/cards'));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.log(err);
  const { statusCode = ERROR_CODE_DEFAULT, message } = err;

  if (err.name === 'ValidationError') {
    return res.status(ERROR_CODE_INVALID_DATA).send({
      message: 'Некорректно введены данные',
    });
  }
  if (err.name === 'CastError') {
    return res.status(ERROR_CODE_INVALID_DATA).send({
      message: 'Некорректно введен ID',
    });
  }
  return res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
