const Card = require('../models/card');
const { handleResponseError } = require('../utils/handleResponseError');

const getCardObj = (card) => {
  const obj = {
    _id: card._id,
    name: card.name,
    link: card.link,
    owner: card.owner,
    likes: card.likes,
    createdAt: card.createdAt,
  };
  return obj;
};

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards.map((card) => getCardObj(card))))
    .catch((err) => handleResponseError(err, res));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(getCardObj(card)))
    .catch((err) => handleResponseError(err, res));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then((card) => res.send(getCardObj(card)))
    .catch((err) => handleResponseError(err, res));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(getCardObj(card)))
    .catch((err) => handleResponseError(err, res));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => res.send(getCardObj(card)))
    .catch((err) => handleResponseError(err, res));
};
