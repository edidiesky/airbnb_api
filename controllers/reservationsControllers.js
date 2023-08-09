// import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import Reservations from "../models/Reservations.js";
import Listing from "../models/Listing.js";
// GET All Reservations
//  Public
const GetAllBuyerReservations = asyncHandler(async (req, res) => {
  // instantiate the request queries
  const queryObject = { listing_host_Id: req.user.userId };

  let result = Reservations.find(queryObject)
    .populate("listing_host_Id", "image username")
    .populate(
      "listing_Id",
      "listing_image listing_price listing_startDate listing_title listing_distance listing_location listing_endDate listing_adults listing_children listing_infants"
    );

  const totalReservations = await Reservations.countDocuments({});

  const reservations = await result;
  if (!reservations) {
    res.status(404);
    throw new Error("You have no reservations");
  } else {
    res.status(200).json({ reservations, totalReservations });
  }
});

// GET SINGLE Listing
// Not Private
const GetSingleBuyerReservations = asyncHandler(async (req, res) => {
  // find the Listing
  const reservations = await Reservations.findOne({
    listing_host_Id: req.user.userId,
  }).populate(
    "listing_Id",
    "listing_image listing_price listing_title listing_location listing_adults listing_children listing_infants"
  );

  if (!reservations) {
    res.status(404);
    throw new Error("Reservations Item not found");
  }
  res.status(200).json({ reservations });
});

//PRIVATE
// ADMIN
const UpdateBuyerReservations = asyncHandler(async (req, res) => {
  const { userId, role } = req.user;
  const reservation = await Reservations.findById({ _id: req.params.id });

  if (!reservation) {
    res.status(404);
    throw new Error("Reservations not found");
  }
  const data = {
    user: userId,
    ...req.body,
  };
  // check for empty values and repeated values

  const updatedListing = await Reservations.findByIdAndUpdate(
    { _id: req.params.id },
    { ...data },
    { new: true }
  );
  res.status(200).json({ updatedListing });
});

// GET SINGLE Reservations
// Private
// Admin and seller
const CreateBuyerReservations = asyncHandler(async (req, res) => {
  // idea
  // get the gig id
  // take in the required number of occupants
  // Create a db for that reservations
  // reduce the author gig in terms of quanitity
  // Be able to update the reservations if the gig is already in the resrevations

  // // get the request body parameters
  const { qty, adults, children, infants, startDate, endDate } = req.body;

  // console.log(qty);
  const { id } = req.params;
  const gig = await Listing.findById({ _id: id });
  const { userId } = req.user;
  if (!gig) {
    res.status(404);
    throw new Error("Listing not found");
  }

  // find the buyer reservations based on its userid and the gig id
  const alreadyinReservations = await Reservations.findOne({
    listing_Id: id,
    listing_host_Id: userId,
  });
  // if in Reservations update it
  if (alreadyinReservations) {
    let reservations = await Reservations.findOneAndUpdate(
      {
        listing_Id: id,
        listing_host_Id: userId,
      },
      { gigQuantity: qty, adults, children, infants, startDate, endDate },
      { new: true }
    );
    res.status(200).json({ reservations });
  } else {
    // "countInStock": 10,
    // checking if the required quantity is greater that the gig countInStock
    // console.log(qty);
    // console.log(gig.countInStock);
    // trying to update the sellers's Listing count in stock
    await Listing.findByIdAndUpdate(
      { _id: id },
      { countInStock: 0 },
      { new: true }
    );

    const reservations = await Reservations.create({
      gigQuantity: qty,
      listing_host_Id: userId,
      listing_Id: id,
      adults,
      children,
      infants,
      startDate,
      endDate,
    });

    res.status(200).json({ reservations });
  }

  // console.log(req.body);
  // res.status(200).json({ alreadyinReservations });
});

//PRIVATE/
// ADMIN
const DeleteBuyerReservations = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId, role } = req.user;
  const gig = await Reservations.findById({ _id: id });

  if (!gig) {
    res.status(404);
    throw new Error("Reservations not found");
  }
  await Reservations.findOneAndDelete({ listing_host_Id: userId, _id: id });
  res
    .status(200)
    .json({ message: "This reservation has been succesfully deleted" });
});

const GetTopRatedBuyerReservations = asyncHandler(async (req, res) => {
  // get the Reservations but based on the rating and then send 4 Reservations
  const toprated = await Reservations.find({}).sort({ rating: -1 }).limit(3);
  res.status(200).json({ toprated });
});

export {
  GetTopRatedBuyerReservations,
  CreateBuyerReservations,
  DeleteBuyerReservations,
  UpdateBuyerReservations,
  GetAllBuyerReservations,
  GetSingleBuyerReservations,
};
