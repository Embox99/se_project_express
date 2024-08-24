const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const User = require("../models/users");
const { errorCode, errorMessage } = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!email || !password) {
    return res
      .status(errorCode.badRequest)
      .send({ message: "Email and password are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(errorCode.badRequest).send({ message: "Invalid Email" });
  }

  return User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new Error("Email is already used");
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      res
        .status(201)
        .send({ name: user.name, avatar: user.avatar, email: user.email });
    })
    .catch((err) => {
      console.error(err);

      if (err.message === "Email is already used") {
        return res
          .status(errorCode.conflictError)
          .send({ message: "Email is already used" });
      }

      if (err.name === "ValidationError") {
        return res
          .status(errorCode.badRequest)
          .send({ message: "Validation failed" });
      }

      return res
        .status(errorCode.serverError)
        .send({ message: errorMessage.defaultError });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(errorCode.badRequest)
      .send({ message: "Email and password are required" });
  }

  if (!validator.isEmail(email)) {
    return res.status(errorCode.badRequest).send({ message: "Invalid Email" });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "wrong email or password") {
        return res
          .status(errorCode.unauthorized)
          .send({ message: "wrong email or password" });
      }
      return res
        .status(errorCode.serverError)
        .send({ message: errorMessage.badRequest });
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
  createUser,
  login,
  getCurrentUser,
  updateCurrentProfile,
};
