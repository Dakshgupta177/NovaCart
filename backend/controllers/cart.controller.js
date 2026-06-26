import { Cart } from "../models/cart.model.js";
import { History } from "../models/history.model.js";
import { Product } from "../models/product.model.js";

export const addCart = async (req, res) => {
  const { productId, quantity } = req.body;
  if (!productId) {
    return res.status(400).json({ message: "product not found" });
  }
  const prod = await Product.findById(productId);
  await History.updateOne(
    { userId: req.user._id },
    { $addToSet: { interest: prod.tags[0] } },
    { upsert: true },
  );
  const existedUser = await Cart.findOne({ user: req.user._id });
  if (existedUser) {
    try {
      const productExist = existedUser.items.find((item) => {
        return item.product == productId;
      });
      if (productExist) {
        await Cart.updateOne(
          { user: req.user._id, "items.product": productId },
          { $inc: { "items.$.quantity": 1 } },
        );
      } else {
        await Cart.updateOne(
          { user: req.user._id },
          { $push: { items: { product: productId, quantity } } },
        );
      }
    } catch (error) {
      return res.status(400).json({ message: error || "something went wrong" });
    }
  } else {
    try {
      const res = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
      console.log(res);
    } catch (error) {
      return res.status(400).json({ message: error || "something went wrong" });
    }
  }
  return res.status(200).json({ message: "successfully added" });
};

export const minusCart = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "Missing productId" });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.items.findIndex(
      (item) => item.product == productId,
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    if (cart.items[productIndex].quantity > 1) {
      cart.items[productIndex].quantity -= 1;
    } else {
      cart.items.splice(productIndex, 1);
    }

    await cart.save();

    return res.status(200).json({ message: "Item quantity updated" });
  } catch (error) {
    return res.status(400).json({ message: error || "something went wrong" });
  }
};

export const getCartDetails = async (req, res) => {
  try {
    const cartData = await Cart.aggregate([
      { $match: { user: req.user._id } },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.product",
          foreignField: "_id",
          as: "Product_details",
        },
      },
      { $unwind: "$Product_details" },
      {
        $addFields: {
          Product_details: {
            $mergeObjects: [
              "$Product_details",
              { quantity: "$items.quantity" },
            ],
          },
        },
      },
      {
        $group: {
          _id: "$_id",
          Products: { $push: "$Product_details" },
          totalQuantity: { $sum: "$items.quantity" },
        },
      },
      {
        $project: {
          _id: 0,
          "Products._id": 1,
          "Products.name": 1,
          "Products.quantity": 1,
          "Products.image": 1,
          "Products.price": 1,
          "Products.description": 1,
          totalQuantity: 1,
        },
      },
    ]);
    return res.status(200).json({
      message: "ok",
      Data: cartData[0],
    });
  } catch (error) {
    return res.status(400).json({ message: error || "something went wrong" });
  }
};
