import express from "express"
import { ai_response_controller } from "../controllers/aiResponse.controller.js"
const router  = express.Router()
router.route("/ai-research").post(ai_response_controller)

export default router 