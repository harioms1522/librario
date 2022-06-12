const express = require("express");
const {
  homePageController,
  adminPanelHomePageController,
  signinController,
  signupController,
} = require("../controllers/viewsController");

const router = express.Router();

router.route("/home").get(homePageController);
router.route("/admin-panel").get(adminPanelHomePageController);
router.route("/signup").get(signupController);
router.route("/signin").get(signinController);
router.route("/home/user").get();

module.exports = router;
