const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middleware/auth");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.post("/logout", userCtrl.logout);
router.get("/account/:id", auth, userCtrl.getUserProfile);
router.put("/account/:id", auth, userCtrl.updateUserProfile);
router.delete("/account/:id", auth, userCtrl.deleteUserProfile);
module.exports = router;
