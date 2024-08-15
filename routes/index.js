const router = require("express").Router();

const userRouter = require("./users");
const clothingItemRouter = require("./clothingItems");
const { errorCode, errorMessage } = require("../utils/errors");

router.use("/users", userRouter);
router.use("/items", clothingItemRouter);
router.use((req, res) => {
  res.status(errorCode.notFound).send({ message: errorMessage.idNotFound });
});

module.exports = router;
