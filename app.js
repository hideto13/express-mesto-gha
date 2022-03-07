const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '6225ce5bb1ec580af7730f88',
  };
  next();
});

app.use('/users', require('./routes/users'));

app.use('/cards', require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
