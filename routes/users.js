const router = require("express").Router();
const auth = require("../middlewares/auth");
const { validateProfileUpdate } = require("../middlewares/validation.js");
const {
  getCurrentUser,
  updateCurrentProfile,
} = require("../controllers/users");

router.use(auth);
router.get("/me", getCurrentUser);
router.patch("/me", validateProfileUpdate, updateCurrentProfile);

module.exports = router;
