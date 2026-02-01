const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../midddleware.js");
const reviewControllers = require("../controller/reivew.js");


router
.route("/")
.post(
  isLoggedIn,
  validateReview,
  wrapAsync(reviewControllers.postReview)
);
router
.route( "/:reviewId")
.delete(
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviewControllers.deleteReview)
);

module.exports = router;
