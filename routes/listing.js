const express =require ("express");
const router= express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js"); // Corrected path


const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = err.details.map((el) => el.message).join(",");
      throw new ExpressError(400,errMsg);
    } else {
      next();
    }
  };


//index route
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }));
  
  //NEW ROUTE
  router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
  });
  
  //SHOW ROUTE
  router.get("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  }));
  
  //CREATE ROUTE
  router.post("/", wrapAsync(async (req, res, next) => {
    if (!req.body.listing) {
      throw new ExpressError(400, "send valid data for listing")
    }
    const newListing = new Listing(req.body.listing);
    if (!newListing.title) {
  
      throw new ExpressError(400, "title is missing ")
  
    }
    if (!newListing.description) {
  
      throw new ExpressError(400, "description is missing ")
  
    }
    if (!newListing.location) {
  
      throw new ExpressError(400, "location is missing ")
  
    }
    await newListing.save();
    res.redirect("/listings");
  }));
  
  //Edit ROUTE
 router.get("/:id/edit", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }));
  
  //update route
  router.put("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }));
  
  //delete route
  router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }));
  

  module.exports=router;