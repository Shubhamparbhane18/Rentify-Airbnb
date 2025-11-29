const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },

  image: {
    filename: {
      type: String,
      default: "listingimage"
    },
    url: {
      type: String,
      default: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d"
    }
  },

  price: {
    type: Number,
    required: true
  },
  location: {
    type: String
  },
  country: {
    type: String
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
