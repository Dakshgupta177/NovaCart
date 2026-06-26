import mongoose from "mongoose";
import { Wishlist } from "../models/wishlist.model.js";

export const toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    if (!productId) {
      return res.status(400).json({ message: "Product is required" });
    }
    const wishlist = await Wishlist.findOne({ userId: req.user._id });
    if (wishlist) {
      const productExists = wishlist.products.some((id) =>
        id.equals(productId),
      );
      if (productExists) {
        wishlist.products.pull(productId);
      } else {
        wishlist.products.push(productId);
      }
      await wishlist.save();
    } else {
      const newWishlist = await Wishlist.create({
        userId: req.user._id,
        products: [productId],
      });
    }

    return res.status(200).json({ message: "Wishlist updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error toggling wishlist" });
  }
};

export const getWishlistDetails = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate({
      path: "products",
      select: "name price image description",
    });
    return res
      .status(200)
      .json({ message: "Successfully fetched", data: wishlist.products });
  } catch (error) {
    return res.status(500).json({ message: "Error in fetching wishlist data" });
  }
};
