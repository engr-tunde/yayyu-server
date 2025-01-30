const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  category: {
    type: String,
    required: true,
  },
  category_slug: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Category", categorySchema);
