import { Router } from "express";
import { adminAccess, changeCurrentUserPassword, deleteUser, editUserAvatar, editUserProfile, getUserProfile, loginUser, logoutUser, refreshAccessToken, signupUser, updateAddress } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router();

router.route("/login").post(loginUser);
router.route("/signup").post(signupUser);
router.route("/logout").post(verifyJWT,logoutUser)
router.route("/refresh/token").post(verifyJWT,refreshAccessToken)
router.route("/changepassword").post(verifyJWT,changeCurrentUserPassword)
router.route("/deleteuser").post(verifyJWT,deleteUser)
router.route("/userprofile").get(verifyJWT,getUserProfile)
router.route("/edituserprofile").post(verifyJWT,editUserProfile)
router.route("/edituseravatar").post(verifyJWT,upload.single('avatar'),editUserAvatar)
router.route("/updateaddress").post(verifyJWT,updateAddress)
router.route("/adminaccess").post(verifyJWT,adminAccess)
export default router;           