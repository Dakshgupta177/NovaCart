import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
export const verifyJWT = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization").replace("Bearer ", "");
    if (!token) {
    console.log("❌ No token found in cookies or headers");
    return res.status(401).json({ message: "Token not found" });
  }
    const decodedUser = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    const user = await User.findById(decodedUser._id).select(
      "-password -refreshToken"
    );
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "unauthorized",
    });
  }
};
