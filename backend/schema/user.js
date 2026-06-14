const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    credits: {
      type: Number,
      default: 10,
    },
    isSubscribed: {
      type: Boolean,
      default: false,
    },
    plan: {
      type: String,
      default: "basic",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
