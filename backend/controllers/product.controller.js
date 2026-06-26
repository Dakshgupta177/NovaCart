import { Product } from "../models/product.model.js";
import axios from "axios";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { History } from "../models/history.model.js";
import { User } from "../models/user.model.js";

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, company, category, items } = req.body;
    const Price = (Number(price) * 1.2) / 80;
    const Items = Number(items);
    if (isNaN(Price) || isNaN(Items)) {
      return res
        .status(400)
        .json({ message: "Price and items must be numbers" });
    }

    if (
      !name ||
      !description ||
      !price ||
      !company ||
      !category ||
      !items
    ) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const productImageLocalPath = req.file?.path;
    console.log(req.file);

    if (!productImageLocalPath) {
      return res.status(400).json({ message: "Image is required" });
    }
    const productImage = await uploadOnCloudinary(productImageLocalPath);
    if (!productImage) {
      return res.status(400).json({
        message: "Image not uploaded successfully. Retry!!",
      });
    }
    console.log(productImage.secure_url);

    await Product.create({
      name,
      description,
      price: Price,
      company,
      category,
      tags: [category],
      items: Items,
      sizes: {
        width: 10,
        height: 12,
        depth: 5,
      },
      rating: 0,
      image: productImage.secure_url,
      images: [productImage.secure_url],
    });
    return res.status(200).json({
      message: "product is created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error creating product",
    });
  }
};

export const getHeroProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .limit(12)
      .skip(80)
      .select("-reviews -items -sizes -company -category -tags -images");
    return res.status(200).json({
      products,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching products",
    });
  }
};

export const getProductbySearchName = async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: "Please enter product name" });
    }
    const product = await Product.find({
      $or: [
        { name: { $regex: name, $options: "i" } },
        { description: { $regex: name, $options: "i" } },
        { category: { $regex: name, $options: "i" } },
        { tags: { $regex: name, $options: "i" } },
      ],
    }).select("-reviews -sizes -company -category -tags -images");

    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product found successfully", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching product",
    });
  }
};

export const getAProduct = async (req, res) => {
  try {
    const { productId } = req.query;
    if (!productId) {
      return res.status(400).json({ message: "Product not found" });
    }
    const product = await Product.findById(productId);
    const history = await History.updateOne(
      { userId: req.user._id },
      { $addToSet: { interest: product.tags[0] } },
      { upsert: true },
    );
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    return res
      .status(200)
      .json({ message: "Product found successfully", product });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching product",
    });
  }
};

export const addReviews = async (req, res) => {
  try {
    const { productId, rating, comment, reviewerName, reviewerEmail } =
      req.body;
    if (!productId || !rating || !comment || !reviewerName || !reviewerEmail) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    product.reviews.push({ rating, comment, reviewerName, reviewerEmail });
    await product.save();
    return res.status(200).json({
      message: "Review added successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error adding review",
    });
  }
};

export const editReviews = async (req, res) => {
  try {
    const { productId, rating, comment, reviewerName, reviewerEmail } =
      req.body;
    if (!productId || !rating || !comment || !reviewerName || !reviewerEmail) {
      return res.status(400).json({ message: "Please enter all fields" });
    }
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(400).json({ message: "Product not found" });
    }
    product.reviews = product.reviews.filter(
      (review) => review.reviewerEmail !== reviewerEmail,
    );
    product.reviews.push({ rating, comment, reviewerName, reviewerEmail });
    await product.save();
    return res.status(200).json({
      message: "Review edited successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error editing review",
    });
  }
};

export const exploreProducts = async (req, res) => {
  try {
    const electronics = await Product.find({
      tags: { $in: ["electronics", "laptops", "smartphones"] },
    }).select("-reviews -items -sizes -company -category -tags -images");
    const fashion = await Product.find({
      tags: { $in: ["clothing", "footwear", "watches"] },
    }).select("-reviews -items -sizes -company -category -tags -images");

    const grocery = await Product.find({
      category: "groceries",
    }).select("-reviews -items -sizes -company -category -tags -images");

    const kitchen = await Product.find({
      category: "kitchen-accessories",
    }).select("-reviews -items -sizes -company -category -tags -images");

    return res.status(200).json({
      message: "Products fetched successfully",
      products: { electronics, fashion, grocery, kitchen },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error fetching products",
    });
  }
};
