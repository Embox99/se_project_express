const router = require("express").Router();

router.get("/", () => {
  console.log("GET itemsDB");
});
router.get("/:userId", () => {
  console.log("GET users by Id");
});
router.post("/", () => {
  console.log("POST users");
});

module.exports = router;