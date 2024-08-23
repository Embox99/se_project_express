const router = require("express").Router();
const {
  getCurrentUser,
  updateCurrentProfile,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.get("/me", auth, getCurrentUser);
router.patch("/me", updateCurrentProfile);

module.exports = router;
