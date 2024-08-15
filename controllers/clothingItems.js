const Item = require("../models/clothingItems");
const { errorCode } = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res.status(errorCode.serverError).send({ message: err.message });
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
        return res.status(errorCode.badRequest).send({ message: err.message });
      }
      return res.status(errorCode.serverError).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  Item.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(200).send({ message: "item deleted succesesfully" }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(errorCode.notFound).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(errorCode.badRequest).send({ message: err.message });
      }
      return res.status(errorCode.serverError).send({ message: err.message });
    });
};

const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(errorCode.notFound).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(errorCode.badRequest).send({ message: err.message });
      }
      return res.status(errorCode.serverError).send({ message: err.message });
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
      res.status(200).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(errorCode.notFound).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(errorCode.badRequest).send({ message: err.message });
      }
      return res.status(errorCode.serverError).send({ message: err.message });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
