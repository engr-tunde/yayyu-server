const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const shippingSchema = new Schema({
  location: {
    type: String,
    required: true,
  },
  delivery_duration: {
    type: String,
    required: true,
  },
  fee: {
    type: Number,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Shipping", shippingSchema);
