import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      index: true,
    },
    category: { 
      type: String,
      required: true,
      trim: true,
      index: true
    },
    tags: [{ type: String, trim: true }],
    sizes:{
      width: {
        required: true,
        type: Number,
        trim: true,
      },
      height: {
        required: true,
        type: Number,
        trim: true,
      },
      depth: {
        required: true,
        type: Number,
        trim: true,
      }
    },
    reviews: [
      {
        rating: {
          type: Number,
          required: true,
        },
        comment: {
          type: String,
          required: true,
        },
        reviewerName: {
          type: String,
          required: true,
        },
        reviewerEmail: {
          type: String,
          required: true,
        },
      },
    ],
    rating: {
      type: Number,
      default: 0,
      maxlength: 5,
    },
    items: {
      type: Number,
      required: true,
      trim: true,
      maxlength: 100,
    },
    image: {
      type: String,
      required: true,
    },
    images: [{ type: String, required: true }],
  },
  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
