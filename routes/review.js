const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/expressError.js");
const { reviewSchema} = require("../schema.js");


//validateReview function for the server side
function validateReview(req, res, next){
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400 , errMsg );
    }else{
        next(); // if we do not get the error then call the next middleware or next execution. means now we can process our request
    }
}




// Reviews Post Route
router.post("/" ,validateReview , wrapAsync(async (req , res)=>{
       
    let {id} = req.params;
    const list1 = await Listing.findById({_id : id});
    const review1 =  new Review(req.body.review);
     list1.reviews.push(review1);
    await review1.save();
    await list1.save();
    req.flash("success" , "New Review is added successfully!");
    res.redirect(`/listing/${list1._id}`);
}));

// Reviews Delete Route
router.delete("/:reviewId" , wrapAsync(async(req , res)=>{
let {id , reviewId } = req.params;
 let l1 = await Listing.findByIdAndUpdate( id, { $pull: { reviews : reviewId}}); // we are deleting the review from the listing 
 await Review.findByIdAndDelete(reviewId); // delete the review from review model
 req.flash("success" , "The Review is deleted successfully!");
 res.redirect(`/listing/${l1._id}`);
}))

module.exports = router;