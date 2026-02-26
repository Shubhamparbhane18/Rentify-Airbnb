const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
  console.log("Connected to DB");
  initDB();
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const initDB = async () => {

  await Listing.deleteMany({});
  console.log("Old listings deleted");

  for (let obj of initData.data) {

    try {

      const url =
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(obj.location)}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "RentifyAirbnbApp/1.0 (rentifyapp@email.com)",
          "Accept": "application/json"
        }
      });

      const text = await response.text();

      // sometimes API sends HTML error page
      if (text.startsWith("<")) {
        throw new Error("Blocked by Nominatim");
      }

      const data = JSON.parse(text);

      if (data.length > 0) {

        obj.latitude = Number(data[0].lat);
        obj.longitude = Number(data[0].lon);

      } else {

        obj.latitude = 0;
        obj.longitude = 0;

      }

      obj.owner = "696fdd12c399850d24babebc";

      await Listing.create(obj);

      await delay(1200); // REQUIRED

    }
    catch (err) {

        console.log("Failed:", obj.location);

    }

  }

  console.log("Database initialized successfully");

};
