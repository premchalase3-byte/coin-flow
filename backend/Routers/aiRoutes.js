import express from "express";
import { financeChatbot } from "../controllers/aiController.js";

const router = express.Router();

router.post("/", financeChatbot);

export default router;