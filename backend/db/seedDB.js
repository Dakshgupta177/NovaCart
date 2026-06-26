import axios from "axios";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const seedProducts = async (req, res) => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const dummyData = await axios.get(
      "https://dummyjson.com/products?limit=194",
    );
    await Product.deleteMany({});
    const products = dummyData.data.products.map((p) => ({
      name: p.title,
      description: p.description,
      price: p.price,
      company: p.brand,
      category: p.category,
      tags: p.tags,
      sizes: p.dimensions,
      reviews: p.reviews,
      rating: p.rating,
      items: p.stock,
      image: p.thumbnail,
      images: p.images,
    }));
    const pass = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await User.create({
      _id: process.env.ADMIN_ID,
      username: process.env.ADMIN_USERNAME,
      email: process.env.ADMIN_EMAIL,
      password: pass,
      fullName: "Admin",
      admin: true,
    });
    await Product.insertMany(products);
    await mongoose.disconnect();
    console.log("Products seeded successfully");
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

seedProducts();