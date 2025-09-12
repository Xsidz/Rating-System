import express from "express"
import { addUser, getAllUsers, getUserDetails } from "../controllers/user.controller.js"
import { requireAuth } from "../middlewares/auth.middleware.js"
const router = express.Router()






router.get("/", requireAuth(['admin']), getAllUsers)
router.post("/", requireAuth(['admin']), addUser)
router.get("/:id", requireAuth(['admin']), getUserDetails)




export default router;