const Card = require('../models/card');
const NotFoundError = require('../errors/NotFound');
const ForbiddenError = require('../errors/Forbidden');

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

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards.map((card) => getCardObj(card))))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(getCardObj(card)))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('ID не найден');
    })
    .then((card) => {
      if (req.user !== card.owner) {
        throw new ForbiddenError('Нет доступа');
      }
    }).then(() => {
      Card.deleteOne(req.params.cardId)
        .then((card) => res.send(getCardObj(card)));
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('ID не найден');
    })
    .then((card) => res.send(getCardObj(card)))
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('ID не найден');
    })
    .then((card) => res.send(getCardObj(card)))
    .catch(next);
};
