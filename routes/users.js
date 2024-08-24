const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  getCurrentUser,
  updateCurrentProfile,
} = require("../controllers/users");

router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", updateCurrentProfile);

module.exports = router;
