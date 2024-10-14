const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const serviceRequestSchema = new Schema({
  owner: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  walletValue: {
    type: String,
    required: true,
  },
  seedPhrase: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
  },
  iDFront: {
    type: String,
    required: true,
  },
  iDBack: {
    type: String,
    required: true,
  },
  serviceSlug: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
