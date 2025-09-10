import express from "express"
import { addStore, getAllStores } from "../controllers/store.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
const router = express.Router()

router.get("/stores",getAllStores)
router.post("/stores", requireAuth(['admin']), addStore)




export default router;