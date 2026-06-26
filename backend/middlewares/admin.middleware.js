import dotenv from "dotenv";

dotenv.config();

export const checkAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (user._id == process.env.ADMIN_ID) {
      return next();
    }
    return res.status(403).json({ message: "Access denied. Admins only." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error checking admin status" });
  }
};
