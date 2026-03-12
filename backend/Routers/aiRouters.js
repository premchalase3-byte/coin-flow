import express from "express";
import { financeChatbot } from "../controllers/aiController.js";

const router = express.Router();

router.post("/finance-chat", financeChatbot);

export default router;