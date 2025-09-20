import express from "express";
import { registerUser, loginUser, logoutUser, dashboard } from "../controllers/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/dashboard", verifyToken, dashboard);

export default router;
