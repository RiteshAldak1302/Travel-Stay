const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema } = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const {isLoggedIn} = require('../middleware.js');



// validateListing function for the server side
function validateListing(req, res, next){
    let {error} = listingSchema.validate(req.body);
    if(error){
        // console.log(error);
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(400 , errMsg );
    }else{
        next(); // if we do not get the error then call the next middleware or next execution. means now we can process our request
    }
}

// index route
router.get("/" , wrapAsync(async (req,res)=>{
    const allListings = await  Listing.find();
  //   console.log(allListings);
    res.render("listings/index.ejs" ,{allListings});
  }));
  
  // new Route
  router.get("/new" , isLoggedIn , wrapAsync(async (req, res)=>{
    //    console.log(req.user);  // it will the essential things of the user if logged in
    
      res.render("listings/new.ejs");
  })
  )
  
  // edit form route : it will give the edit form
  router.get("/:id/edit", isLoggedIn,wrapAsync(async (req , res )=>{
      let {id} = req.params;
      const listing = await Listing.findById(id);
      res.render("listings/edit.ejs", {listing});
  }))
  
  
  
  // show Route
  router.get("/:id" , wrapAsync(async (req , res)=>{
          let {id} = req.params;
      const listing = await Listing.findById(id).populate("reviews").populate("owner");
      if(!listing){
        req.flash("error" , "listing you requested does not exist");
        res.redirect("/listing");
      }
      res.render("listings/show.ejs", {listing});
      
  }));
  
  
  // Create Route : Post route which will create new list in the database 
  router.post("/", isLoggedIn ,validateListing, wrapAsync(async (req, res , next)=>{
     const list1 =  new Listing (req.body.listing);
      list1.owner = req.user._id; // storing the owner id by using req.user method
      await list1.save();
      req.flash("success" , "New list is Created!");  // success is key
      res.redirect("/listing");
    
  }) 
  );
  
  // PUT Route : to update the specific list in the database
  router.put("/:id", isLoggedIn, validateListing, wrapAsync(async(req, res)=>{
      let {id} = req.params;
      
      await Listing.findByIdAndUpdate(id , {...req.body.listing});
      req.flash("success" , "The list is Updated Successfully!");
      if(!listing){
        req.flash("error" , "listing you requested does not exist");
      }
      res.redirect(`/listing`);
  }));
  
  // DElETE Route
  router.delete("/:id" , isLoggedIn, wrapAsync(async (req, res)=>{
      let {id} = req.params;
      await Listing.findByIdAndDelete(id);
      req.flash("success" , "The list is Deleted Successfully!");
      res.redirect("/listing");
  }));
  
  module.exports = router;  // it is important to export