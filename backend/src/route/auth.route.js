import express from "express";
import {
  checkAuth,
  logIn,
  logOut,
  signUp,
} from "../controllers/auth.controller.js";
const router = express.Router();

router.get("/signup", signUp);
router.get("/login", logIn);
router.get("/logout", logOut);
router.get("/check", checkAuth);

export default router;
