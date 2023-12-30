const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.createReview = async (req , res)=>{
       
    let {id} = req.params;
    const list1 = await Listing.findById({_id : id});
    const review1 =  new Review(req.body.review);
    review1.author = req.user._id;
     list1.reviews.push(review1);
    await review1.save();
    await list1.save();
    req.flash("success" , "New Review is added successfully!");
    res.redirect(`/listing/${list1._id}`);
}

module.exports.deleteReview = async(req , res)=>{
    let {id , reviewId } = req.params;
     let l1 = await Listing.findByIdAndUpdate( id, { $pull: { reviews : reviewId}}); // we are deleting the review from the listing 
     await Review.findByIdAndDelete(reviewId); // delete the review from review model
     req.flash("success" , "The Review is deleted successfully!");
     res.redirect(`/listing/${l1._id}`);
}