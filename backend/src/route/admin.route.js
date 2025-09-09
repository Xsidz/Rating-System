import express from "express"
import {addStore, addUser, getAllStores, getAllUsers, getDashboard, getUserDetails} from "../controllers/admin.controller.js"
import { requireAuth } from "../middlewares/auth.middleware.js"
const router = express.Router()

router.use( requireAuth(["admin"]) )

router.get("/dashboard", getDashboard )


router.get("/users/:id", getUserDetails)
router.post("/users", addUser )
router.get("/users", getAllUsers )


router.post("/stores",addStore)
router.get("/stores",getAllStores)







export default router;