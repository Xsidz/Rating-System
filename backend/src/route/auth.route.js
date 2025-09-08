import express from "express";
import {
  checkAuth,
  logIn,
  logOut,
  signUp,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/signup", signUp);
router.post("/login", logIn);
router.get("/logout", logOut);
router.get("/check", checkAuth);

export default router;
