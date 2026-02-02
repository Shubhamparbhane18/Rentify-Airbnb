const Listing=require("../models/listing.js");

module.exports.index=async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.newListing=
  (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.editListing=async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist!");
    return res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { listing });
};

module.exports.showListings=async (req, res) => {
  let {id}=req.params;
  const listing = await Listing.findById(req.params.id).populate({
    path:"reviews",populate:{
      path:"author",
    },
  }).populate("owner");

  if (!listing) {
    req.flash("error", "Listing you requested doesn't exist!");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
}
;
module.exports.createListing=async (req, res) => {
  let url=req.file.path;
  let filename=req.file.filename;

  const newListing = new Listing(req.body.listing);
  newListing.owner=req.user._id;
  newListing.image={url,filename};
  await newListing.save();
  req.flash("success", "New listing is created!");
  res.redirect("/listings");
};
module.exports.updateListing=async (req, res) => {
  let {id}=req.params;
  await Listing.findByIdAndUpdate(id,{...req.body.listing});
  req.flash("success","Listing Update!");
  res.redirect(`/listings/${id}`);
};
module.exports.deleteListing=async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);

  req.flash("success", "Listing Deleted Successfully!");
  res.redirect("/listings");
};