const User = require("../models/users");
const { errorCode, errorMessage } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(errorCode.serverError)
        .send({ message: errorMessage.defaultError });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(errorCode.badRequest)
          .send({ message: errorMessage.validationError });
      }
      return res
        .status(errorCode.serverError)
        .send({ message: errorMessage.defaultError });
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      console.error(err);
      console.log(err.name);
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

module.exports = { getUsers, createUser, getUserById };
