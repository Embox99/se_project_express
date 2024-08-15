const router = require("express").Router();
const { getUsers, createUser, getUserById } = require("../controllers/users");

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:userId", getUserById);

module.exports = router;
