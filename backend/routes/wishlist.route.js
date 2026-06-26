import { Router } from "express";
import { getWishlistDetails, toggleWishlist } from "../controllers/wishlist.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/togglewishlist").post(verifyJWT, toggleWishlist);
router.route("/wishlistdetails").get(verifyJWT, getWishlistDetails);

export default router;