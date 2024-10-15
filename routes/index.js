const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const {
  validateLogin,
  validateCreateUser,
} = require("../middlewares/validation");
const { errorCode, errorMessage } = require("../utils/errors");
const NotFoundError = require("../errors/notFoundError");
const { login, createUser } = require("../controllers/users");

router.post("/signin", validateLogin, login);
router.post("/signup", validateCreateUser, createUser);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use((req, res, next) =>
  next(new NotFoundError(errorMessage.idNotFound))
);

module.exports = router;
