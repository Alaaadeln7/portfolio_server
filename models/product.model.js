const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: true,
  },
  technologies: {
    type: Array,
    required: true,
  },
  links: {
    type: Array,
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
