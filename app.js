const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");

app.use(express.urlencoded({ extended: true }));  // For EJS forms
app.use(express.json());                          // For Hoppscotch / Postman
// JSON

const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";
const ExpressError = require("./utils/ExpressError.js");

const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
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

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

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
