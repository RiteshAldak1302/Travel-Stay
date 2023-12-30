const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");
const {signUp , registeringUser ,loginPage ,authenticatingUser , logout} = require("../controllers/user.js");

// registering the new user to the db
router.route("/signup")
.get(signUp)
.post(wrapAsync(registeringUser));

// redering the login form // authenticating the info of user with the data base's info this will login into session if info is correct as in db
router.route("/login")
.get(loginPage )
.post(saveRedirectUrl , passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), authenticatingUser);

// logout route
router.get("/logout", logout);

module.exports = router;