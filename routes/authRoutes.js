import express from "express";
import {
  registerUser,
  forgotPassword,
  validateToken,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// Register new user
router.post("/register", registerUser);

// Forgot password (send reset link)
router.post("/forgot-password", forgotPassword);

// Validate token
router.get("/reset-password/validate/:token", validateToken);

// Reset password
router.post("/reset-password/:token", resetPassword);

export default router;
