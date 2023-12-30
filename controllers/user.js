const User = require("../models/user.js");

module.exports.signUp = (req, res) => {
    res.render("users/signup.ejs");
}

module.exports.registeringUser = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });  // the key and value has same name. so, we can use the 

        const registeredUser = await User.register(newUser, password); // registering the user into the database
        // console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) { next(err); }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listing");
        })
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}

module.exports.loginPage = (req, res) => {
    res.render("users/login.ejs");
}

module.exports.authenticatingUser = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust!");
    const redirectUrl = res.locals.redirectUrl || '/listing' ;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "logged you out!");
        res.redirect("/listing");
    })

}