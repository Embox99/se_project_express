const User = require("../models/users");
const { errorCode } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(errorCode.serverError).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(errorCode.badRequest).send({ message: err.message });
      }
      return res.status(errorCode.serverError).send({ message: err.message });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
      if (err.name === "DocumentNotFoundError") {
        return res.status(errorCode.notFound).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res.status(errorCode.badRequest).send({ message: err.message });
      }
      return res.status(errorCode.serverError).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUserById };
