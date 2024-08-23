const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const { errorCode, errorMessage } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

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
  const { name, avatar, email, password } = req.body;
  const hashedPassword = bcrypt.hash(password, 10);
  User.create({ name, avatar, email, password: hashedPassword })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.code === 11000) {
        return res
          .status(errorCode.badRequest)
          .send({ message: "email is already used" });
      }
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

const login = (req, res) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      res
        .status(errorCode.unauthorized)
        .send({ message: "wrong email or password" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(errorCode.notFound)
          .send({ message: errorMessage.idNotFound });
      }
      return res.send(user);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(errorCode.serverError)
        .send({ message: errorMessage.defaultError });
    });
};

const updateCurrentProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(errorCode.notFound)
          .send({ message: errorMessage.idNotFound });
      }
      return res.send(user);
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

module.exports = {
  getUsers,
  createUser,
  getUserById,
  login,
  getCurrentUser,
  updateCurrentProfile,
};
