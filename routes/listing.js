const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../midddleware.js");
const listingsController=require("../controller/listings.js")
const multer=require('multer');
const {storage}=require("../cloud_Config.js");
const upload =multer({storage});
router
  .route("/")
  .get(wrapAsync(listingsController.index))
  .post(isLoggedIn,upload.single("image"),validateListing ,wrapAsync(listingsController.createListing));
  
router.route("/new")
  .get(isLoggedIn,listingsController.newListing);
router.route("/:id/edit")
.get(isLoggedIn,isOwner,wrapAsync(listingsController.editListing))


router.route("/:id")
  .get( wrapAsync(listingsController.showListings))
  .put( isLoggedIn,isOwner,upload.single("image"),validateListing, wrapAsync(listingsController.updateListing))
  .delete(isLoggedIn,isOwner, wrapAsync(listingsController.deleteListing))


module.exports = router;
