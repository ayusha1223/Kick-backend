const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "FVHJAFJHSFVBSFBSSFJSF";

const authMiddleware = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.replace("Bearer ", ""), JWT_SECRET);
        req.user = decoded; // Attach user info to request
        next();
    } catch (error) {
        return res.status(400).json({ error: "Invalid token" });
    }
};

module.exports = authMiddleware;
