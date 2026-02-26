const Listing = require("../models/listing.js");

// ====================== INDEX ======================
module.exports.index = async (req, res) => {

  let { search } = req.query;

  if (search) {
    search = search.trim();

    const filteredListings = await Listing.find({
      $or: [
        { location: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } }
      ]
    });

    if (filteredListings.length === 0) {
      req.flash("error", `No listings found for "${search}"`);
      return res.redirect("/listings");
    }

    return res.render("listings/index", {
      allListings: filteredListings
    });
  }

  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

// ====================== NEW ======================
module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};

// ====================== EDIT ======================
module.exports.editListing = async (req, res) => {

  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist!");
    return res.redirect("/listings");
  }

  const resizedImageUrl = listing.image?.url
    ? listing.image.url.replace("/upload", "/upload/w_150,h_150,c_fit")
    : null;

  res.render("listings/edit.ejs", { listing, resizedImageUrl });
};

// ====================== SHOW ======================
module.exports.showListings = async (req, res) => {

  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: { path: "author" }
    })
    .populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

// ====================== CREATE ======================
module.exports.createListing = async (req, res) => {

  let url, filename;

  if (req.file) {
    url = req.file.path;
    filename = req.file.filename;
  }

  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  newListing.image = { url, filename };

  const locationName = req.body.listing.location;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`
  );

  const data = await response.json();

  if (data.length === 0) {
    req.flash("error", "Please enter a valid location name.");
    return res.redirect("/listings/new");
  }

  newListing.latitude = parseFloat(data[0].lat);
  newListing.longitude = parseFloat(data[0].lon);

  await newListing.save();

  req.flash("success", "New listing created successfully!");
  res.redirect("/listings");
};

// ====================== UPDATE ======================
module.exports.updateListing = async (req, res) => {

  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  Object.assign(listing, req.body.listing);

  if (req.file) {
    listing.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  const locationName = req.body.listing.location;

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}`
  );

  const data = await response.json();

  if (data.length === 0) {
    req.flash("error", "Please enter a valid location name");
    return res.redirect(`/listings/${id}/edit`);
  }

  listing.latitude = parseFloat(data[0].lat);
  listing.longitude = parseFloat(data[0].lon);

  await listing.save();

  req.flash("success", "Listing Updated Successfully!");
  res.redirect(`/listings/${id}`);
};

// ====================== DELETE ======================
module.exports.deleteListing = async (req, res) => {

  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found!");
    return res.redirect("/listings");
  }

  await Listing.findByIdAndDelete(id);

  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};