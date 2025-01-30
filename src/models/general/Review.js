const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  owner: {
    type: String,
    required: true,
  },
  reviewer: {
    type: String,
    required: true,
  },
  rating: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
