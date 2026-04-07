//!   -------     server/ server.js      -------

//mt Import routes
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import db from "./db.js";

dotenv.config();

// const commentRoutes = require("./routes/comments");
import commentRoutes from "./routes/comments.js";

//mt Initialize Express app
const app = express();
const PORT = process.env.SERVER_PORT || 5000;

//mt Middleware
app.use(cors());
app.use(express.json());

//! Test Routes

//mt Test server
// localhost:3000/
app.get("/", (req, res) => {
    res.send("Server is running ✅");
});

//@ localhost:3000/test-db  (ShutDown this route after testing)
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