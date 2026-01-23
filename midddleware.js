const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Listing=require("./models/listing");
const Review=require("./models/review");
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl=req.originalUrl;
    req.flash("error", "You must be logged in to create listings.");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
  if(req.session.redirectUrl){
    res.locals.redirectUrl=req.session.redirectUrl;
  }
  next();
}

module.exports.isOwner=async (req,res,next)=>{
  const {id}=req.params;
  const listing=await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the owner of the listing");
    return res.redirect(`/listings/${id}`)
  }
  next();
}

// Validation middleware
module.exports.validateListing = (req, res, next) => {
  const { error } = listingSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }
  next();
};

// Validate review
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  }
  next();
};

module.exports.isReviewAuthor=async (req,res,next)=>{
  const {id,reviewId}=req.params;
  const review=await Review.findById(reviewId);
  if (!review.author._id.equals(res.locals.currUser._id)) {
    req.flash("error", "you are not the author of the review");
    return res.redirect(`/listings/${id}`)
  }
  next();
}