const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const contentSchema = new Schema({
  published_by: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  cover_image: {
    type: String,
    required: true,
  },
  post_status: {
    type: String,
    required: true,
  },
  views_count: {
    type: Number,
    default: 0,
  },
  published_date: {
    type: Date,
    default: Date.now,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Content', contentSchema);
