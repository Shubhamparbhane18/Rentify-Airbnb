const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../midddleware.js");

// INDEX
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// NEW
router.get("/new",isLoggedIn,
  (req, res) => {
    
    res.render("listings/new.ejs");
  });
 

// EDIT
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(async (req, res) => {

  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist!");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
}));

// SHOW
router.get("/:id", wrapAsync(async (req, res) => {
  let {id}=req.params;
  const listing = await Listing.findById(req.params.id).populate({
    path:"reviews",populate:{
      path:"author",
    },
  }).populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
}));

// CREATE
router.post("/", isLoggedIn,validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  await newListing.save();
  req.flash("success", "New listing is created!");
  res.redirect("/listings");
}));

// UPDATE
router.put("/:id", isLoggedIn,isOwner,validateListing, wrapAsync(async (req, res) => {
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success","Listing Update!");
  res.redirect(`/listings/${id}`);
}));

// DELETE
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);

  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
}));

module.exports = router;
