import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";
import Listing from "../models/Listing.js";
import cloudinaryModule from "../utlis/cloudinary.js";
// GET All Listing
//  Public
const GetAllListing = asyncHandler(async (req, res) => {
  // instantiate the request queries
  const queryObject = {};
  // min and max price
  // search and userId
  // category
  const type = req.query.type;
  const listing_endDate = req.query.listing_endDate;
  const listing_startDate = req.query.listing_startDate;
  const listing_region = req.query.listing_region;
  const listing_country = req.query.listing_country;
  const listing_city = req.query.listing_city;
  const sort = req.query.sort;
  const listing_host_Id = req.query.user;

  if (type) {
    queryObject.listing_type = type;
  }
  if (listing_endDate) {
    queryObject.listing_endDate = listing_endDate;
  }
  if (listing_startDate) {
    queryObject.listing_startDate = listing_startDate;
  }

  if (listing_country) {
    queryObject.listing_country = listing_country;
  }
  if (listing_region) {
    queryObject.listing_region = listing_region;
  }
  // based on listing_city
  if (listing_city) {
    queryObject.listing_city = listing_city;
  }
  // based on user
  if (listing_host_Id) {
    queryObject.listing_host_Id = listing_host_Id;
  }

  const limit = req.query.limit || 12;
  const page = req.query.page;
  const skip = (page - 1) * limit;

  let result = Listing.find(queryObject)
    .skip(skip)
    .limit(limit)
    .populate("listing_host_Id", "image username");

  // perform sorting operation
  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }

  // console.log(queryObject)

  const totalListing = await Listing.countDocuments({});
  const noOfPages = Math.ceil(totalListing / limit);

  const gig = await result;
  res.status(200).json({ gig, totalListing, noOfPages });
});
//
// GET SINGLE Listing
// Not Private
const GetSingleListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // find the Listing
  const gig = await Listing.findById({ _id: id }).populate(
    "listing_host_Id",
    "username image country role"
  );
  if (!gig) {
    res.status(404);
    throw new Error("Listing not found");
  }
  res.status(200).json({ gig });
});

// GET User Listing
// Not Private
const GetHostListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // find the Listing
  const gig = await Listing.findOne({ listing_host_Id: id }).populate(
    "listing_host_Id",
    "username image country role"
  );
  if (!gig) {
    res.status(404);
    throw new Error("Listing not found");
  }
  res.status(200).json({ gig });
});

// GET User Listing
// Not Private
// Admin and seller
const CreateSingleListing = asyncHandler(async (req, res) => {
  // get the request body parameters
  const { userId, role } = req.user;
  const gig = await Listing.create({
    listing_host_Id: userId,
    ...req.body,
  });
  res.status(200).json({ gig });
});

//PRIVATE
// ADMIN and seller
const UpdateListing = asyncHandler(async (req, res) => {
  const { userId, role } = req.user;

  const gig = await Listing.findById({ _id: req.params.id });

  if (!gig) {
    res.status(404);
    throw new Error("Listing not found");
  }
  // res.send(role)
  // console.log((role === 'admin'));
  // check if the user is the seller or is admin
  if (gig.listing_host_Id.toString() === userId || role === "admin") {
    const data = {
      listing_host_Id: userId,
      ...req.body,
    };
    // check for empty values and repeated values

    const updatedListing = await Listing.findByIdAndUpdate(
      { _id: req.params.id },
      { ...data },
      { new: true }
    );
    res.status(200).json({ updatedListing });
  } else {
    res.status(404);
    throw new Error("You are not authorized to perform this action");
  }
});

//PRIVATE/
// ADMIN
const DeleteListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  const gig = await Listing.findById({ _id: id });

  if (!gig) {
    res.status(404);
    throw new Error("Listing not found");
  }
  // res.send(role)
  // console.log((role === 'admin'));
  // console.log(gig.listing_host_Id.toString() !== userId);
  // check if the user is the seller or is admin
  if (gig.listing_host_Id.toString() === userId || role === "admin") {
    await Listing.findByIdAndDelete({ _id: req.params.id });
    res
      .status(200)
      .json({ message: "The Listing has been successfully deleted" });
  } else {
    res.status(404);
    throw new Error("You are not authorized to perform this action");
  }
  // console.log(gig);
  // res.status(200).json({ gig});

  // console.log('Helolo world');
});

export {
  GetSingleListing,
  GetAllListing,
  UpdateListing,
  DeleteListing,
  CreateSingleListing,
  GetHostListing,
};
