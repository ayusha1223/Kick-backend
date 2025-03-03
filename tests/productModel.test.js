const SequelizeMock = require('sequelize-mock');
const { DataTypes } = require('sequelize');

// Create a mock connection
let DBConnectionMock;
let ResumeMock;

// Mock User model
const UserMock = {
    id: 1,
    name: "John Doe",
};

// Mock data
const mockResumeData = {
    resume_id: 1,
    user_id: UserMock.id,
    title: "Software Engineer",
    summary: "Experienced software engineer.",
    education: [{ degree: "BSc Computer Science", institution: "University A" }],
    work_experience: [{ job_title: "Developer", company: "Company A" }],
    skills: ["JavaScript", "Node.js"],
    projects: [{ name: "Project A", description: "Description of Project A" }],
    certifications: [{ name: "Certified Developer", issuing_organization: "Organization A" }],
    contact_info: { phone: "123-456-7890", email: "john.doe@example.com" },
    pdf_url: "http://example.com/resume.pdf",
};

describe("Resume Model", () => {
    beforeEach(() => {
        // Create a new mock connection and model before each test
        DBConnectionMock = new SequelizeMock();
        ResumeMock = DBConnectionMock.define('Resume', {
            resume_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                unique: true,
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
                type: DataTypes.JSON,
                allowNull: true,
            },
            work_experience: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            skills: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            projects: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            certifications: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            contact_info: {
                type: DataTypes.JSON,
                allowNull: true,
            },
            pdf_url: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        }, {
            timestamps: true,
            tableName: "resumes"
        });
    });

    test("Create a new resume", async () => {
        DBConnectionMock.$queueResult(mockResumeData); // Mock the result of create
        const resume = await ResumeMock.create(mockResumeData);
        expect(resume.resume_id).toBe(1);
        expect(resume.title).toBe(mockResumeData.title);
    });

    test("Read a resume", async () => {
        DBConnectionMock.$queueResult(mockResumeData); // Mock the result of findOne
        const resume = await ResumeMock.findOne({ where: { user_id: UserMock.id } });
        expect(resume).toBeDefined();
        expect(resume.title).toBe(mockResumeData.title);
    });

    test("Update a resume", async () => {
        // Mock the result of findOne
        DBConnectionMock.$queueResult(mockResumeData);
        const resume = await ResumeMock.findOne({ where: { user_id: UserMock.id } });

        // Simulate the update
        const updatedResumeData = { ...resume, title: "Senior Software Engineer" };
        
        // Mock the result of update to return an array with the number of affected rows
        DBConnectionMock.$queueResult([1]); // Simulate that one row was updated
        const updatedResume = await ResumeMock.update(updatedResumeData, { where: { user_id: UserMock.id } });

        expect(updatedResume[0]).toBe(1); // Sequelize returns an array with the number of affected rows
    });

    test("Delete a resume", async () => {
        // Mock the result of findOne
        DBConnectionMock.$queueResult(mockResumeData);
        const resume = await ResumeMock.findOne({ where: { user_id: UserMock.id } });

        // Mock the result of destroy
        DBConnectionMock.$queueResult(1); // Simulate successful deletion
        await ResumeMock.destroy({ where: { user_id: UserMock.id } });

        // Mock the result of findOne to return null after deletion
        DBConnectionMock.$queueResult(null);
        const deletedResume = await ResumeMock.findOne({ where: { user_id: UserMock.id } });
        expect(deletedResume).toBeNull();
    });
});