const express = require("express");
const { registerUser, loginUser, getUsers, updateProfile, getUserById } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware"); // Import authentication middleware

const router = express.Router();

// User registration route
router.post("/register", registerUser);

// User login route
router.post("/login", loginUser);

// Get all users (for admin/testing purposes)
router.get("/show_users", getUsers);

// Get user by ID (Protected route)
router.get("/user/:id", authMiddleware, getUserById); // ✅ Corrected route

// Update user profile (Protected route)
router.put("/update_users", authMiddleware, updateProfile);

module.exports = router;
