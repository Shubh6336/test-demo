import { Router } from "express";
import {
  createUser,
  login,
  fetchUserData,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/token.js";

const router = Router();

// Signup route - public
router.post("/signup", createUser);

// Login route - public
router.post("/login", login);

// Get current logged-in user - protected
router.get("/me", verifyToken, fetchUserData);

// Get any user by ID - protected
router.get("/:id", verifyToken, fetchUserData);

export default router;
