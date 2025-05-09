const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
    // required: true,
  },
  item_name: {
    type: String,
    required: true,
  },
  item_slug: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  specification: {
    type: Array,
    required: true,
  },
  original_price: {
    type: Number,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  sizes: {
    type: Array,
  },
  colors: {
    type: Array,
  },
  img: {
    type: String,
    required: true,
  },
  images: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
