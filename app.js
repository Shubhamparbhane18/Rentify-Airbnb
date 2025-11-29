const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing =require("./models/listing.js");
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

app.get("/",(req,res)=>{
  res.send("hi,I am robot");
});

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

app.listen(8080,()=>{
  console.log("server is listening to port 8080");

})