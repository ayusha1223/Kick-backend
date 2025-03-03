const Resume = require("../models/Resume");
const User = require("../models/User");

// Create or Update Resume
const createOrUpdateResume = async (req, res) => {
    const { user_id, title, summary, education, work_experience, skills, projects, certifications, contact_info } = req.body;

    try {
        // Check if user exists
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if resume already exists for this user
        let resume = await Resume.findOne({ where: { user_id } });

        if (resume) {
            // Update existing resume
            await resume.update({ title, summary, education, work_experience, skills, projects, certifications, contact_info });
            return res.status(200).json({ message: "Resume updated successfully", resume });
        } else {
            // Create new resume
            resume = await Resume.create({ user_id, title, summary, education, work_experience, skills, projects, certifications, contact_info });
            return res.status(201).json({ message: "Resume created successfully", resume });
        }
    } catch (error) {
        console.error("Error creating/updating resume:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};

// Get Resume by User ID
const getResumeByUserId = async (req, res) => {
    const { user_id } = req.params;

    try {
        const resume = await Resume.findOne({ where: { user_id } });

        if (!resume) {
            return res.status(404).json({ error: "Resume not found" });
        }

        return res.status(200).json(resume);
    } catch (error) {
        console.error("Error fetching resume:", error);
        return res.status(500).json({ error: "Something went wrong" });
    }
};


// Delete Resume by User ID
const deleteResume = async (req, res) => {
    const { user_id } = req.params;

    try {
        const resume = await Resume.findOne({ where: { user_id } });

        if (!resume) {
            return res.status(404).json({ error: "Resume not found" });
        }

        await resume.destroy();
        res.status(200).json({ message: "Resume deleted successfully" });
    } catch (error) {
        console.error("Error deleting resume:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
};

module.exports = { createOrUpdateResume, getResumeByUserId, deleteResume };
