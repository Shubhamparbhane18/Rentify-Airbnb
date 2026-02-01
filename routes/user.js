const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const passport = require("passport");
const { saveRedirectUrl } = require("../midddleware.js");

const userControllers = require("../controller/user.js");

router.get("/signup", userControllers.signup);
router.post("/signup", wrapAsync(userControllers.correctSignIn));

router.get("/login", userControllers.loginIn);

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  userControllers.correctLogIn
);

router.get("/logout", userControllers.logOut);

module.exports = router;
