const Listing = require("../models/listing.js");


module.exports.index  = async (req,res)=>{
    const allListings = await  Listing.find();
  //   console.log(allListings);
    res.render("listings/index.ejs" ,{allListings});
  }


  module.exports.renderNewForm  = async (req, res)=>{
    //    console.log(req.user);  // it will the essential things of the user if logged in
    
      res.render("listings/new.ejs");
  }


  module.exports.renderEditForm  = async (req , res )=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}


module.exports.showListing  = async (req , res)=>{
    let {id} = req.params;
const listing = await Listing.findById(id).populate({path : "reviews", populate:{path : "author"}}).populate("owner");
if(!listing){
  req.flash("error" , "listing you requested does not exist");
  res.redirect("/listing");
}
res.render("listings/show.ejs", {listing});

}

module.exports.createListing = async (req, res , next)=>{
    const list1 =  new Listing (req.body.listing);
     list1.owner = req.user._id; // storing the owner id by using req.user method
     await list1.save();
     req.flash("success" , "New list is Created!");  // success is key
     res.redirect("/listing");
   
 }

module.exports.updateListing = async(req, res)=>{
    let {id} = req.params;
    
    const listing = await Listing.findByIdAndUpdate(id , {...req.body.listing});
    req.flash("success" , "The list is Updated Successfully!");
    if(!listing){
      req.flash("error" , "listing you requested does not exist");
    }
    res.redirect(`/listing`);
}

module.exports.deleteListing = async (req, res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "The list is Deleted Successfully!");
    res.redirect("/listing");
}