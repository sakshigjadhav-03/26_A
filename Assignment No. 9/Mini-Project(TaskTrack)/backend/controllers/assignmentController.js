const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Assignment = require("../models/Assignment");

const makeToken = user => jwt.sign({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
}, process.env.JWT_SECRET, { expiresIn: "7d" });

// REGISTER
exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name?.trim() || !email?.trim() || !password || !role)
            return res.status(400).json({ message: "All fields are required." });

        if (!["Student", "Teacher"].includes(role))
            return res.status(400).json({ message: "Invalid role." });

        if (password.length < 6)
            return res.status(400).json({ message: "Password must have at least 6 characters." });

        const normalizedEmail = email.trim().toLowerCase();

        if (await User.findOne({ email: normalizedEmail }))
            return res.status(409).json({ message: "Email is already registered." });

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: await bcrypt.hash(password, 10),
            role
        });

        res.status(201).json({
            token: makeToken(user),
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Registration failed." });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "Email and password are required." });

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user || !(await bcrypt.compare(password, user.password)))
            return res.status(401).json({ message: "Invalid email or password." });

        res.json({
            token: makeToken(user),
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed." });
    }
};

// TEACHER: GET STUDENT LIST
exports.getStudents = async (req, res) => {
    const students = await User.find(
        { role: "Student" },
        "name email"
    ).sort({ name: 1 });

    res.json(students);
};

// GET ASSIGNMENTS FOR CURRENT USER
exports.getAssignments = async (req, res) => {
    try {
        if (req.user.role === "Teacher") {
            const assignments = await Assignment.find({
                createdBy: req.user.id
            })
                .populate("students.student", "name email")
                .sort({ dueDate: 1 });

            return res.json(assignments);
        }

        const assignments = await Assignment.find({
            "students.student": req.user.id
        })
            .populate("createdBy", "name")
            .sort({ dueDate: 1 });

        res.json(assignments);
    } catch (err) {
        res.status(500).json({ message: "Could not load assignments." });
    }
};

// TEACHER: CREATE AND DISTRIBUTE
exports.createAssignment = async (req, res) => {
    try {
        const {
            title, subject, description, dueDate,
            priority, assignTo, studentIds
        } = req.body;

        if (!title?.trim() || !subject?.trim() || !dueDate)
            return res.status(400).json({
                message: "Title, subject and due date are required."
            });

        if (Number.isNaN(Date.parse(dueDate)))
            return res.status(400).json({ message: "Invalid due date." });

        let ids = [];

        if (assignTo === "all") {
            const students = await User.find({ role: "Student" }, "_id");
            ids = students.map(s => s._id);
        } else if (assignTo === "selected" && Array.isArray(studentIds)) {
            ids = [...new Set(studentIds)];
        } else {
            return res.status(400).json({ message: "Choose who receives this assignment." });
        }

        if (!ids.length)
            return res.status(400).json({ message: "No students selected or registered yet." });

        const validCount = await User.countDocuments({
            _id: { $in: ids },
            role: "Student"
        });

        if (validCount !== ids.length)
            return res.status(400).json({ message: "One or more selected students are invalid." });

        const assignment = await Assignment.create({
            title: title.trim(),
            subject: subject.trim(),
            description: description || "",
            dueDate,
            priority: ["Low", "Medium", "High"].includes(priority)
                ? priority : "Medium",
            createdBy: req.user.id,
            students: ids.map(student => ({
                student,
                status: "Pending"
            }))
        });

        await assignment.populate("students.student", "name email");
        res.status(201).json(assignment);
    } catch (err) {
        res.status(400).json({ message: "Could not create assignment." });
    }
};

// STUDENT: UPDATE ONLY THEIR OWN STATUS AND SUBMISSION
exports.updateStatus = async (req, res) => {
    try {
        if (req.user.role !== "Student")
            return res.status(403).json({
                message: "Only students can update submission status."
            });

        const { status, submissionLink } = req.body;
        const validStatuses = ["Pending", "In Progress", "Submitted"];

        if (!validStatuses.includes(status))
            return res.status(400).json({ message: "Invalid status." });

        if (status === "Submitted" &&
            (!submissionLink || !submissionLink.trim())) {
            return res.status(400).json({
                message: "Add your submission link before submitting."
            });
        }

        if (submissionLink) {
            try {
                const url = new URL(submissionLink);
                if (!["http:", "https:"].includes(url.protocol))
                    throw new Error("Invalid protocol");
            } catch {
                return res.status(400).json({
                    message: "Enter a valid http or https submission link."
                });
            }
        }

        const assignment = await Assignment.findOne({
            _id: req.params.id,
            "students.student": req.user.id
        });

        if (!assignment)
            return res.status(404).json({
                message: "Assignment not found for your account."
            });

        const mine = assignment.students.find(
            s => s.student.toString() === req.user.id
        );

        mine.status = status;

        if (submissionLink !== undefined)
            mine.submissionLink = submissionLink.trim();

        mine.submittedAt = status === "Submitted" ? new Date() : null;

        await assignment.save();

        res.json({ message: "Your assignment status was updated." });
    } catch (err) {
        res.status(500).json({ message: "Could not update submission." });
    }
};

// TEACHER: DELETE THEIR OWN ASSIGNMENT
exports.deleteAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findOne({
            _id: req.params.id,
            createdBy: req.user.id
        });

        if (!assignment)
            return res.status(404).json({
                message: "Assignment not found or you cannot delete it."
            });

        await assignment.deleteOne();
        res.json({ message: "Assignment deleted." });
    } catch (err) {
        res.status(500).json({ message: "Could not delete assignment." });
    }
};