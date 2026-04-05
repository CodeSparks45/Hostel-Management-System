const express = require("express");
const router = express.Router();
const { signup, login, completeProfile } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware"); // Zaroori hai

// Public Routes
router.post("/signup", signup);
router.post("/login", login);

// Protected Route (Profile Completion)
router.put("/complete-profile", authMiddleware, completeProfile);

module.exports = router;