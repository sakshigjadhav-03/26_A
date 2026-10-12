const express = require("express");
const jwt = require("jsonwebtoken");

const {
    signup, login, getStudents, getAssignments,
    createAssignment, updateStatus, deleteAssignment
} = require("../controllers/assignmentController");

const router = express.Router();

const protect = (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header?.startsWith("Bearer "))
            return res.status(401).json({ message: "Please sign in." });

        req.user = jwt.verify(
            header.split(" ")[1],
            process.env.JWT_SECRET
        );

        next();
    } catch {
        res.status(401).json({ message: "Session expired. Please sign in again." });
    }
};

const teacherOnly = (req, res, next) => {
    if (req.user.role !== "Teacher")
        return res.status(403).json({ message: "Teacher access required." });
    next();
};

router.post("/signup", signup);
router.post("/login", login);
router.get("/students", protect, teacherOnly, getStudents);
router.get("/", protect, getAssignments);
router.post("/", protect, teacherOnly, createAssignment);
router.patch("/:id/status", protect, updateStatus);
router.delete("/:id", protect, teacherOnly, deleteAssignment);

module.exports = router;