const { ERROR_CODE_DEFAULT, ERROR_CODE_INVALID_DATA, ERROR_CODE_NOT_FOUND } = require('./constants');

module.exports.handleResponseError = (err, res) => {
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
  if (err.message === 'NotFound') {
    return res.status(ERROR_CODE_NOT_FOUND).send({
      message: 'ID не найден',
    });
  }
  return res.status(ERROR_CODE_DEFAULT).send({
    message: 'Произошла ошибка',
  });
};
