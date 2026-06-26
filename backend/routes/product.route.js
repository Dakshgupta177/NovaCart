import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createProduct, getAProduct, getHeroProducts, addReviews, editReviews, exploreProducts, getProductbySearchName } from "../controllers/product.controller.js";


const router = Router()

router.route("/createproduct").post(verifyJWT,upload.single('image'),createProduct)
router.route("/getaproduct").post(verifyJWT, getAProduct)
router.route("/getheroproducts").get(verifyJWT, getHeroProducts)
router.route("/addreviews").post(verifyJWT, addReviews)
router.route("/editreviews").post(verifyJWT, editReviews)
router.route("/exploreproducts").get(verifyJWT, exploreProducts)
router.route("/searchproducts").get(verifyJWT, getProductbySearchName)


export default router;