const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateUserId,
  validateCreateItem,
} = require("../middlewares/validation");
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
  getItems,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.use(auth);

router.post("/", validateCreateItem, createItem);
router.delete("/:itemId", validateUserId, deleteItem);
router.put("/:itemId/likes", validateUserId, likeItem);
router.delete("/:itemId/likes", validateUserId, dislikeItem);

module.exports = router;
