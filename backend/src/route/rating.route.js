import { Router } from "express";
import { createRating, editRating, storeRatings } from "../controllers/rating.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();


router.post("/" , requireAuth(['user']) ,  createRating);


router.put("/:id", requireAuth(['user']) ,editRating);


router.get("/stores/:id", requireAuth(['store_owner']),  storeRatings);

export default router;

