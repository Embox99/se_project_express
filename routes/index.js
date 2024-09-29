const router = require("express").Router();
const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const {
  validateLogin,
  validateCreateUser,
} = require("../middlewares/validation");
const { errorCode, errorMessage } = require("../utils/errors");
const { login, createUser } = require("../controllers/users");

router.post("/signin", validateLogin, login);
router.post("/signup", validateCreateUser, createUser);

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use((req, res) => {
  res.status(errorCode.notFound).send({ message: errorMessage.idNotFound });
});

module.exports = router;
