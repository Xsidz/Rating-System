import express from "express";
const router = express.Router();
import { requireAuth } from "../middlewares/auth.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

router.get("/", requireAuth(["admin"]), getDashboard);


export default router;

