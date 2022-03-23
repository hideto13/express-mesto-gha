const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { ERROR_CODE_NOT_FOUND } = require('./utils/constants');
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

app.use((req, res) => {
  res.status(ERROR_CODE_NOT_FOUND).send({
    message: 'Некорректный запрос',
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
