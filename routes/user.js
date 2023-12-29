const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js");


router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

// registering the new user to the db
router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });  // the key and value has same name. so, we can use the 

        const registeredUser = await User.register(newUser, password); // registering the user into the database
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) { next(err); }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listing");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}));

// redering the login form
router.get("/login", (req, res) => {
    res.render("users/login.ejs");
});

// authenticating the info of user with the data base's info this will login into session if info is correct as in db
router.post("/login", saveRedirectUrl , passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    const redirectUrl = res.locals.redirectUrl || '/listing' ;
    res.redirect(redirectUrl);
});

// 
router.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logged you out!");
        res.redirect("/listing");
    })

})



module.exports = router;