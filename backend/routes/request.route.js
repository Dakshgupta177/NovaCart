import { Router } from "express";
import { verifyJWT } from '../middlewares/auth.middleware.js';
import { checkAdmin } from '../middlewares/admin.middleware.js';
import { getAdminRequests, requestAdminAccess } from '../controllers/request.controller.js';

const router = Router();

router.route("/acceptorreject").post(verifyJWT, checkAdmin, requestAdminAccess);
router.route("/getdata").get(verifyJWT, checkAdmin, getAdminRequests);

export default router;