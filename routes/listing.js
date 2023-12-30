const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync");
const {isLoggedIn , isOwner , validateListing} = require('../middleware.js');
const multer  = require('multer')
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });

const {index , renderNewForm ,renderEditForm , showListing , createListing , updateListing, deleteListing} = require("../controllers/listing.js");

// index route and create route: Post route which will create new list in the database 
router
.route("/")
.get( wrapAsync(index))
.post( isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(createListing));
// .post(upload.single('listing[image]') ,(req, res)=>{
//      res.send(req.file);
// })

  // new Route
  router.get("/new" , isLoggedIn , wrapAsync(renderNewForm));
  
  // edit form route : it will give the edit form
  router.get("/:id/edit", isLoggedIn,wrapAsync(renderEditForm))
  
  // show Route // Update Route : to update the specific list in the database  // DElETE Route
  router.route("/:id")
  .get( wrapAsync(showListing))
  .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(updateListing))
  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing));
  
  module.exports = router;  // it is important to export