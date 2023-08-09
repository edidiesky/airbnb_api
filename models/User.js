import mongoose from "mongoose";

// a structure of the user
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
    },
    image: {
      type: String,
    },

    email: {
      type: String,
      required: [true, "PLease add an emailvalue"],
    },
    password: {
      type: String,
      required: [true, "PLease add a password value"],
    },

    country: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    level: {
      type: String,
      default: "level 1 seller",
      enum: ["level 1 seller", "level 2 seller", "level 3 seller"],
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
