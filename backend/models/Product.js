const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    images: [
      {
        url: { type: String, default: "" },
        public_id: { type: String, default: "" },
      },
    ],

    category: {
      type: String,
      default: "Fashion",
    },

    gender: {
      type: String,
      enum: ["men", "women", "unisex"],
      lowercase: true,
      trim: true,
      default: "unisex",
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Product",
  productSchema
);
