import { User } from "../models/user.model.js";
import bcrypt from "bcrypt";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import nodemailer from "nodemailer";
import { Request } from "../models/request.model.js";

const generatingAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};

export const signupUser = async (req, res) => {
  try {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password || !fullName) {
      return res.status(400).json({ message: "Please enter all fields" });
    }

    const ExistedUser = await User.findOne({ $or: [{ email }, { username }] });
    if (ExistedUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const Password = await bcrypt.hash(password, 12);

    const user = await User.create({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password: Password,
      fullName,
    });
    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );
    if (!createdUser) {
      return res.status(500).json({ message: "User not created" });
    }

    const { accessToken, refreshToken } =
      await generatingAccessAndRefreshTokens(user._id);
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    };
    return res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json({
        message: "User signed up successfully",
        user: createdUser,
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
      return res
        .status(400)
        .json({ message: "Please enter email or username atleast !!" });
    }
    const emailOrUser = emailOrUsername.toLowerCase();
    const user = await User.findOne({
      $or: [{ email: emailOrUser }, { username: emailOrUser }],
    });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User does not exist !! Please Signup first !!" });
    }
    const isPasswordCorrect = await user.checkPassword(password);

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const { accessToken, refreshToken } =
      await generatingAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );
    if (!loggedInUser) {
      return res.status(500).json({ message: "User not found" });
    }
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    };
    res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json({
        message: "User logged in successfully",
        user: loggedInUser,
        refreshToken,
        accessToken,
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { refreshToken: "undefined" },
      },
      { new: true },
    );
  } catch (error) {
    return res.status(500).json({
      message: "Unauthorized Request",
    });
  }
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  };
  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json({
      message: "User logged out successfully",
    });
};

export const refreshAccessToken = async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    return res.status(401).json({
      message: "RefreshToken not found",
    });
  }
  try {
    const { refreshToken, accessToken } =
      await generatingAccessAndRefreshTokens(req.user._id);

    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    };

    res
      .status(200)
      .cookie("refreshToken", refreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json({
        message: "Refresh token refreshed",
        refreshToken,
        accessToken,
      });
  } catch (error) {
    return res.status(401).json({
      message: "invalid refresh token",
    });
  }
};

export const changeCurrentUserPassword = async (req, res) => {
  const { oldpassword, newpassword, confirmpassword } = req.body;

  if (!oldpassword || !newpassword || !confirmpassword) {
    return res.status(400).json({
      message: "Please enter all fields",
    });
  }
  if (newpassword !== confirmpassword) {
    return res.status(400).json({
      message: " Password does not match with confirm password",
    });
  }
  try {
    const user = await User.findById(req.user._id);

    const comparedPassword = await user.checkPassword(oldpassword);

    if (!comparedPassword) {
      return res.status(400).json({
        message: "oldpassword is incorrect",
      });
    }
    const newPassword = await bcrypt.hash(newpassword, 12);
    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Password not changed",
    });
  }
};

export const deleteUser = async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({
      message: "Please enter password",
    });
  }
  try {
    const user = await User.findById(req.user._id);

    const isPasswordCorrect = await user.checkPassword(password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        message: "Invalid password",
      });
    }
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
    };
    await user.deleteOne({ _id: req.user._id });
    return res
      .status(200)
      .clearCookie("refreshToken", options)
      .clearCookie("accessToken", options)
      .json({
        message: "User deleted successfully",
      });
  } catch (error) {
    return res.status(500).json({
      message: "User not deleted",
    });
  }
};

export const editUserProfile = async (req, res) => {
  const { username, fullName, email } = req.body.data;
  const { id } = req.body;

  if (!username && !fullName && !email) {
    return res.status(400).json({
      message: "Please enter all field to update",
    });
  }
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken",
  );
  if (!user) {
    res.status(400).json({
      message: "User not found",
    });
  }
  const ExistedUser = await User.findOne({ username });
  const ExistedEmail = await User.findOne({ email });

  if (ExistedUser && ExistedUser._id.toString() !== id) {
    return res.status(400).json({ message: "Username already exists" });
  }
  if (ExistedEmail && ExistedEmail._id.toString() !== id) {
    return res.status(400).json({ message: "Email already exists" });
  }
  if (username) {
    user.username = username;
  }
  if (fullName) {
    user.fullName = fullName;
  }
  if (email) {
    user.email = email;
  }
  user.save({ validateBeforeSave: true });

  return res.status(200).json({
    message: "User profile updated successfully",
    data: user,
  });
};

export const editUserAvatar = async (req, res) => {
  const user = await User.findById(req.user);
  const avatarLocalPath = req.file?.path;
  if (!avatarLocalPath) {
    return res.status(400).json({
      message: "Image not found",
    });
  }
  const avatarImage = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarImage) {
    return res.status(500).json({
      message: "Image not uploaded",
    });
  }
  user.avatar = avatarImage.secure_url;
  await user.save({ validateBeforeSave: true });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res.status(200).json({
    message: "User avatar updated successfully",
    data: createdUser,
  });
};

export const getUserProfile = async (req, res) => {
  return res.status(200).json({
    message: "User profile fetched successfully",
    data: req.user,
  });
};

export const updateAddress = async (req, res) => {
  const { phone, address, pin, city } = req.body;
  if (!phone || !address || !city || !pin) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findOne({ _id: req.user._id });

  if (!user) {
    return req.status(400).json({ message: "unauthorized" });
  }
  user.address = address;
  user.pin = pin;
  user.phone = phone;
  user.city = city;

  await user.save({ validateBeforeSave: false });
  return res.status(200).json({
    message: "successfully updated",
    user,
  });
};

export const adminAccess = async (req, res) => {
  const { email, message, businessName, userId } = req.body;

  if (!email || !message || !businessName) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      return res.status(400).json({
        message: "unauthorized",
      });
    }

    await Request.create({
      userId,
      email,
      message,
      businessName,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: process.env.EMAIL_USERNAME,
      subject: "Asking Admin Access",
      replyTo: email,
      text: `Message: ${message}\nFrom: ${email}\nBusiness Name: ${businessName}\nUser ID: ${user._id}`,
    });

    return res.status(200).json({
      message: "successfully send",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
