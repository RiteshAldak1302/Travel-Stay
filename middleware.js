module.exports.isLoggedIn = (req , res , next ) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be logged in to create listing!");
        return res.redirect("/login");
   }
   next();  //if user is already logged in. so, it will give control to next execution
}

module.exports.saveRedirectUrl = (req, res , next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}