const router = require("express").Router();

router.get("/", () => {
  console.log("GET itemsDB");
});
router.post("/", () => {
  console.log("POST a new item");
});
router.delete("/:itemID", () => {
  console.log("DELETE item by id");
});

module.exports = router;
