const Item = require("../models/clothingItems");
const { errorCode, errorMessage } = require("../utils/errors");
const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../errors/errors");

const getItems = (req, res, next) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      next(err);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError(errorMessage.badRequest));
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  Item.findById(itemId)
    .orFail(() => new NotFoundError(errorMessage.idNotFound))
    .then((item) => {
      if (item.owner.toString() !== userId) {
        throw new ForbiddenError("Access denied");
      }
      return Item.findByIdAndDelete(itemId);
    })
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err instanceof NotFoundError || err instanceof ForbiddenError) {
        next(err);
      } else if (err.name === "CastError") {
        next(new BadRequestError(errorMessage.badRequest));
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError(errorMessage.idNotFound))
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err instanceof NotFoundError) {
        next(err);
      } else if (err.name === "CastError") {
        next(BadRequestError(errorMessage.badRequest));
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => new NotFoundError(errorMessage.idNotFound))
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err instanceof NotFoundError) {
        next(err);
      } else if (err.name === "CastError") {
        next(new BadRequestError(errorMessage.badRequest));
      } else {
        next(err);
      }
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
