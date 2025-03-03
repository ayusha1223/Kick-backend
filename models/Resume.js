const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const User = require("./User"); // Import User model

const Resume = sequelize.define("Resume", {
    resume_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Ensures one resume per user
        references: {
            model: User,
            key: "id",
        },
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    summary: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    education: {
        type: DataTypes.JSON, // Stores multiple education entries
        allowNull: true,
    },
    work_experience: {
        type: DataTypes.JSON, // Stores multiple work experience entries
        allowNull: true,
    },
    skills: {
        type: DataTypes.JSON, // Stores skills as an array
        allowNull: true,
    },
    projects: {
        type: DataTypes.JSON, // Stores projects as an array
        allowNull: true,
    },
    certifications: {
        type: DataTypes.JSON,
        allowNull: true,
    },
    contact_info: {
        type: DataTypes.JSON, // Stores phone, email, LinkedIn, GitHub, etc.
        allowNull: true,
    },
    pdf_url: {
        type: DataTypes.STRING, // Stores the generated CV PDF URL
        allowNull: true,
    },
}, {
    timestamps: true,
    tableName: "resumes"
});

// Set up One-to-One relationship with User
User.hasOne(Resume, { foreignKey: "user_id", onDelete: "CASCADE" });
Resume.belongsTo(User, { foreignKey: "user_id" });

module.exports = Resume;
