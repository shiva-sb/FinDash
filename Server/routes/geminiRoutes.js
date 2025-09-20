
import express from "express";
import multer from "multer";
import { askGemini } from "../controllers/geminiController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });



router.post("/", verifyToken, upload.array("files", 2), askGemini);

export default router;