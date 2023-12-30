const Listing = require("./models/listing");
const Review = require("./models/review.js");
const ExpressError = require("./utils/expressError.js");
const {listingSchema,reviewSchema } = require("./schema.js");


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

module.exports.isOwner = async ( req , res , next) =>{
    let { id } =  req.params;
    let list = await Listing.findById(id);

    if( res.locals.currUser && !list.owner._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not owner of this list");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async ( req , res , next) =>{
    let { id , reviewId } =  req.params;
    let review1 = await Review.findById(reviewId);

    if( res.locals.currUser && !review1.author._id.equals(res.locals.currUser._id)){
        req.flash("error" , "You are not author of this review");
        return res.redirect(`/listing/${id}`);
    }
    next();
}


// validateListing function for the server side
module.exports.validateListing = function (req, res, next){
    let {error} = listingSchema.validate(req.body);
    if(error){
        // console.log(error);
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400 , errMsg );
    }else{
        next(); // if we do not get the error then call the next middleware or next execution. means now we can process our request
    }
}

//validateReview function for the server side
module.exports.validateReview = function (req, res, next){
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400 , errMsg );
    }else{
        next(); // if we do not get the error then call the next middleware or next execution. means now we can process our request
    }
}