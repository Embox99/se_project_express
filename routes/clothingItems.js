const router = require("express").Router();
const { getItems } = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", () => {
  console.log("create a new item");
});
router.delete("/:itemID", () => {
  console.log("DELETE item by id");
});

module.exports = router;
