const Item = require("../models/clothingItems");
const { errorCode, errorMessage } = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(errorCode.serverError)
        .send({ message: errorMessage.defaultError });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  Item.create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(errorCode.badRequest)
          .send({ message: errorMessage.defaultError });
      }
      return res
        .status(errorCode.serverError)
        .send({ message: errorMessage.defaultError });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.send({ message: "item deleted succesesfully" }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(errorCode.notFound)
          .send({ message: errorMessage.idNotFound });
      }
      if (err.name === "CastError") {
        return res
          .status(errorCode.badRequest)
          .send({ message: errorMessage.badRequest });
      }
      return res
        .status(errorCode.serverError)
        .send({ message: errorMessage.defaultError });
    });
};

const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(errorCode.notFound)
          .send({ message: errorMessage.idNotFound });
      }
      if (err.name === "CastError") {
        return res
          .status(errorCode.badRequest)
          .send({ message: errorMessage.badRequest });
      }
      return res
        .status(errorCode.serverError)
        .send({ message: errorMessage.defaultError });
    });
};

const dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(errorCode.notFound)
          .send({ message: errorMessage.idNotFound });
      }
      if (err.name === "CastError") {
        return res
          .status(errorCode.badRequest)
          .send({ message: errorMessage.badRequest });
      }
      return res
        .status(errorCode.serverError)
        .send({ message: errorMessage.defaultError });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
