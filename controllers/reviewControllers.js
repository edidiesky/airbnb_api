
import asyncHandler from "express-async-handler";
import Gig from "../models/Listing.js";
import Reviews from "../models/Reviews.js";

// Create reviews
//  Public
const createReviews = asyncHandler(async (req, res) => {
  const { userId, role, name, username } = req.user;

  // send an error to prevent the user from reviewing twice
  // get the body parameter
  const { description, rating } = req.body;
  if (!description || !rating) {
    res.status(404);
    throw new Error("The review form should be completely filled");
  }

  // get the gig for reviews
  const gig = await Gig.findById({ _id: req.params.id });
  // // locate the gig
  if (!gig) {
    res.status(404);
    throw new Error("No reviews has been found");
  }

  // check for permissions (admin and users)
  if (role === "user" || role === "admin") {
    const data = {
      listing_host_Id: gig.listing_host_Id,
      description,
      rating,
      gig: gig._id,
      listing_buyer_Id: userId,
    };

    // check if the user has alraedy review the gig
    const reviewed = await Reviews.findOne({
      gig: gig._id,
      listing_buyer_Id: userId,
    });
    // send an error
    if (reviewed) {
      res.status(404);
      throw new Error("You can't review this gig/service twice");
    }
    // destructure the data and then create it
    const review = await Reviews.create({ ...data });

    res.status(200).json({ review });
  } else {
    res.status(404);
    throw new Error("You are not authorized to perform this action");
  }
});

// GET Review of the user gig
//  Public
// send the gig id only
const getSellerReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const queryObject = { listing_host_Id: id };
  let result = Reviews.find(queryObject);

  // find the Seller reviews based on its id
  const reviews = await result
    .populate("listing_buyer_Id", "country email username image")
    .populate("listing_host_Id", "username image email");
  if (!reviews) {
    res.status(404);
    throw new Error("No reviews has been found");
  }
  // get the review length
  // get the total rating

  res.status(200).json({ reviews });
});

// GET All Gig
//  Public
// send the gig id only
const getAllReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  // find the Gig
  const reviews = await Reviews.find({})
    .populate("listing_buyer_Id", "country email username")
    .populate("listing_host_Id", "username");
  if (!reviews) {
    res.status(404);
    throw new Error("No reviews has been found");
  }

  res.status(200).json({ reviews });
});



// GET All Gig
//  Public
const DeleteReviews = asyncHandler(async (req, res) => {
  res.status(200).json({ msg: "delete review controller" });
});

export { createReviews, getSellerReviews, DeleteReviews, getAllReviews };
