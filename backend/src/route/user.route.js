import express from "express"
import { addUser, getAllUsers, getUserDetails} from "../controllers/admin.controller.js"
import { requireAuth } from "../middlewares/auth.middleware.js"
const router = express.Router()






router.get("/:id",requireAuth(['admin']), getUserDetails)
router.post("/",requireAuth(['admin']), addUser )
router.get("/",requireAuth(['admin']), getAllUsers )




export default router;