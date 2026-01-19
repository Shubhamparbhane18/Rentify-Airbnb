const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

// Validate review
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// POST review
router.post("/", validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);

  listing.reviews.push(newReview._id);

  await newReview.save();
  await listing.save();
  req.flash("success","Review added successfully!");
  res.redirect(`/listings/${listing._id}`);
}));

// DELETE review
router.delete("/:reviewId", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
  });

  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");

  res.redirect(`/listings/${id}`);
}));

module.exports = router;
