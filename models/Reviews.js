import mongoose from "mongoose";

// a structure of the review
const ReviewSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },

    listing_host_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    listing_Id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listings",
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    listing_buyer_Id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    rating: { type: Number, required: true },
    numreview: { type: Number },
    likes: [],
    sellerResponse: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", ReviewSchema);
