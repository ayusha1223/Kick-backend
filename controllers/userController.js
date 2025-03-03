const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// Secret key for JWT (Use environment variables in production)
const JWT_SECRET = process.env.JWT_SECRET || "FVHJAFJHSFVBSFBSSFJSF";

// Register User
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
        return res.status(400).json({
            error: "Please provide name, email, and password",
        });
    }

    try {
        // Check if email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({
                error: "Email is already registered. Please login.",
            });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await User.create({ name, email, password: hashedPassword });

        return res.status(201).json({ message: "Registration successful", user: newUser });
    } catch (error) {
        console.error("Registration error:", error);
        return res.status(500).json({ error: "Something went wrong during registration" });
    }
};
// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
        return res.status(400).json({
            error: "Please provide email and password",
        });
    }

    try {
        // Find the user by email
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({
                error: "User does not exist. Please register first.",
            });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                error: "Invalid password. Please try again.",
            });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { user_id: user.id, name: user.name, email: user.email },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        // ✅ Return `userId` along with the token
        return res.status(200).json({ 
            message: "Successfully logged in", 
            token, 
            userId: user.id // ✅ Send user ID to frontend 
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "Something went wrong during login" });
    }
};


// Get All Users (Admin or testing purpose)
const getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ["password"] }, // Exclude passwords for security
        });
        res.status(200).json(users);
    } catch (error) {
        console.error("Fetch users error:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

// Update User Profile
const updateProfile = async (req, res) => {
    const { name, email, password } = req.body;
    const userId = req.user.user_id; // Assuming user_id is extracted from JWT middleware

    try {
        // Find the user
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const saltRounds = 10;
            user.password = await bcrypt.hash(password, saltRounds);
        }

        await user.save(); // Save updates

        return res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Profile update error:", error);
        return res.status(500).json({ error: "Failed to update profile" });
    }
};

// Get User By ID
const getUserById = async (req, res) => {
    const { id } = req.params; // Extract user ID from request params

    try {
        // Find user by ID
        const user = await User.findByPk(id, {
            attributes: { exclude: ["password"] }, // Exclude password for security
        });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        return res.status(500).json({ error: "Failed to fetch user" });
    }
};


module.exports = { registerUser, loginUser, getUsers, updateProfile, getUserById };
