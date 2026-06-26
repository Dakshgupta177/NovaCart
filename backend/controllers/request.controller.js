import { Request } from "../models/request.model.js";
import { User } from "../models/user.model.js";

export const requestAdminAccess = async (req, res) => {
  try {
    const { accept, userId } = req.body;
    if (accept) {
      const user = await User.findById(userId);
      user.admin = true;
      await user.save();
    } else {
      await Request.findOneAndDelete({ userId });
    }
    return res.status(200).json({ message: "Request processed successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error processing request" });
  }
};

export const getAdminRequests = async (req, res) => {
    try {
        const requests = await Request.find();
        return res.status(200).json({ message: "Successfully fetched", data: requests });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error fetching requests" });
    }
};