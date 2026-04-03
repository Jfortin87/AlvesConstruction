const express = require("express");
const cors = require("cors");
const db = require("./db");

//mt Import routes
const commentRoutes = require("./routes/comments");

const app = express();
const PORT = 3000;

//mt Middleware
app.use(cors());
app.use(express.json());

//! Test Routes
// localhost:3000/
app.get("/", (req, res) => {
    res.send("Server is running ✅");
});

// localhost:3000/test-db
app.get("/test-db", (req, res) => {
    const rows = db.prepare("SELECT * FROM comments").all();
    res.json(rows);
});

//mt Use routes
app.use("/api/comments", commentRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});