import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getSuggestion, searchProductByAi } from "../controllers/ai.controller.js";
import rateLimit from "express-rate-limit";

const router=Router()

const rate = rateLimit({
    windowMs: 60 * 60 * 1000,
    limit: 3,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
})

router.route("/getsuggestions").get(verifyJWT, getSuggestion)
router.route("/searchproductbyai").post(rate, verifyJWT, searchProductByAi)

export default router;