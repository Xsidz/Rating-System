import express from "express";
import {

  logIn,
  logOut,
  signUp,
  updatePassword,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.post("/logout", logOut);
router.post("/update-password", requireAuth,  updatePassword )


export default router;
