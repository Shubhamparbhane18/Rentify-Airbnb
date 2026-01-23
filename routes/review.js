const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview,isLoggedIn, isReviewAuthor}=require("../midddleware.js");


// POST review
router.post("/", isLoggedIn,validateReview, wrapAsync(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);
  newReview.author=req.user._id;
  listing.reviews.push(newReview._id);

  await newReview.save();
  await listing.save();
  req.flash("success","Review added successfully!");
  res.redirect(`/listings/${listing._id}`);
}));

// DELETE review
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  const review=await Review.findById
  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
  });

  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");

  res.redirect(`/listings/${id}`);
}));

module.exports = router;
