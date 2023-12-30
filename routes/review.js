const express = require("express");
const router = express.Router({mergeParams : true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync");
const {validateReview ,isLoggedIn ,isReviewAuthor} = require("../middleware.js");
const {createReview, deleteReview } = require("../controllers/review.js");


// Reviews Post Route
router.post("/" , isLoggedIn,validateReview , wrapAsync(createReview));

// Reviews Delete Route
router.delete("/:reviewId", isLoggedIn, isReviewAuthor , wrapAsync(deleteReview));

module.exports = router;