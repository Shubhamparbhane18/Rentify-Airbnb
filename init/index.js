const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");  

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; 
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Review.deleteMany({});
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner:"696fdd12c399850d24babebc"}));
  await Listing.insertMany(initData.data);
};

initDB();
