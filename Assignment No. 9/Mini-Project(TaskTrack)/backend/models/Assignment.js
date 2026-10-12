const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "In Progress", "Submitted"],
        default: "Pending"
    },
    submissionLink: { type: String, default: "" },
    submittedAt: { type: Date, default: null }
}, { _id: false });

const assignmentSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    dueDate: { type: Date, required: true },
    priority: {
        type: String,
        enum: ["Low", "Medium", "High"],
        default: "Medium"
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    students: [studentSchema]
}, { timestamps: true });

module.exports = mongoose.model("Assignment", assignmentSchema);