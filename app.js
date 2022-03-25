const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, errors, Joi } = require('celebrate');
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

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().min(10),
    about: Joi.string().min(2).max(60),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  }),
}), login);

app.use('/users', auth, require('./routes/users'));

app.use('/cards', auth, require('./routes/cards'));

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Некорректный запрос'));
});

app.use(errors());

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  res.status(statusCode).send({ message });
  next();
});

app.listen(PORT);
