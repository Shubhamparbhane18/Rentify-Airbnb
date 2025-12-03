const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing =require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate= require("ejs-mate");

const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

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
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
  res.send("hi,I am robot");
});
//index route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
});
//new rout
app.get("/listings/new",async(req,res)=>{
  res.render("listings/new.ejs");
});
//show route
app.get("/listings/:id",async (req,res)=>{
  let {id}=req.params;
  const listing=await Listing.findById(id);
  res.render("listings/show.ejs",{listing} );
});
//create route
app.post("/listings",async (req,res)=>{
  // let{title,description,image,price,country,location}=req.body;
  // let listing=req.body.listings;
  const newListing=new Listing(req.body.listings);
  await newListing.save();
  // console.log(listing);
  res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit",async (req,res)=>{
 let{id}=req.params;
 const listing=await Listing.findById(id);
 res.render("listings/edit.ejs",{listing});
});


//update route
app.put("/listings/:id",async(req,res)=>{
  let{id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  //res.redirect("/listings"); 
  res.redirect(`/listings/${id}`); 
});

//delete
app.delete("/listings/:id",async(req,res)=>{
  let{id}=req.params;
  let deletedListing=await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
});
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
});
*/
app.listen(8080,()=>{
  console.log("server is listening to port 8080");

})