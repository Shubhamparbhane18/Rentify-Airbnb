const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

app.use(express.urlencoded({ extended: true }));  // For EJS forms
app.use(express.json());                          // For Hoppscotch / Postman
// JSON

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const Review=require("./models/review.js"); 

const listings=require("./routes/listing.js");
main()
  .then(()=>{
    console.log("connected to db");
  })
  .catch((err)=>{
    console.log(err);
  });

async function main(){
  await mongoose.connect(mongo_url);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
  res.send("hi,I am robot");
});
//validate review
//middleware for the validation of schemas
const validateReview= (req,res,next)=>{
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const errMsg = error.details.map(el => el.message).join(", ");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

app.use("/listings",listings);
//review 
//post route
app.post("/listings/:id/reviews", validateReview, wrapAsync(async (req,res) => {
  const listing = await Listing.findById(req.params.id);
  const newReview = new Review(req.body.review);

  listing.reviews.push(newReview._id);

  await newReview.save();
  await listing.save();
 res.redirect(`/listings/${listing._id}`);
}));
 //delete route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId } 
  });

  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/listings/${id}`);
}));


/*
app.get("/testListing",async (req,res)=>{
  let sampleListing=new Listing({
    title:"My New Villa",
    description: "By the beach",
    price:1200,
    location:"calangute,goa",
    country: "India",
  });
  await sampleListing.save();
  console.log("sample was saved");
  res.send("succesfull connection");
});*/

app.use((req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs",{message });
  /*res.status(statusCode).send( message );
*/
});

app.listen(8080,()=>{
  console.log("server is listening to port 8080");
});
