const express = require("express");
const { createOrUpdateResume, getResumeByUserId, deleteResume } = require("../controllers/resumeController");
const authMiddleware = require("../middleware/authMiddleware"); // Import authentication middleware
const router = express.Router();

// Create or Update Resume
router.post("/create_resume", authMiddleware, createOrUpdateResume);

// Get Resume by User ID
router.get("/:user_id", authMiddleware, getResumeByUserId);

// Delete Resume by User ID
router.delete("/:user_id", deleteResume);

module.exports = router;
