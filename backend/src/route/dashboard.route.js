import express from "express";
const router = express.Router();
import { requireAuth } from "../middlewares/auth.middleware.js";

router.get("/", requireAuth(["admin"]), dashboardStats);


export default router;

