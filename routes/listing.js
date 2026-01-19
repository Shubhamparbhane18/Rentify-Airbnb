const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");

// Validation middleware
const validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// INDEX
router.get("/", wrapAsync(async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
}));

// NEW
router.get("/new", (req, res) => {
  res.render("listings/new.ejs");
});

// EDIT
router.get("/:id/edit", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist!");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
}));

// SHOW
router.get("/:id", wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate("reviews");

  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
}));

// CREATE
router.post("/", validateListing, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();

  req.flash("success", "New listing is created!");
  res.redirect("/listings");
}));

// UPDATE
router.put("/:id", validateListing, wrapAsync(async (req, res) => {
  const updatedListing = await Listing.findByIdAndUpdate(
    req.params.id,
    req.body.listing,
    { new: true }
  );

  if (!updatedListing) {
    req.flash("error", "Listing you requested doesn't exist!");
    return res.redirect("/listings");
  }

  req.flash("success", "Listing updated successfully!");
  res.redirect(`/listings/${updatedListing._id}`);
}));

// DELETE
router.delete("/:id", wrapAsync(async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);

  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
}));

module.exports = router;
