const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const assignmentRoutes = require("./routes/assignmentRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("TaskTrack API is running!"));

app.use("/api/assignments", assignmentRoutes);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch(err => console.error("MongoDB connection failed:", err.message));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
    console.log(`Server running on http://localhost:${PORT}`)
);