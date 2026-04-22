//!   -------     server/ server.js      -------

//!       -- Imports --
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import isAdmin from "./middleware/isAdmin.js";



// DB Table Model
import db from "./db.js";

import bcrypt from "bcrypt";

dotenv.config();


//!       -- Import routes --
import commentRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";

//mt Pay Tracker routes
import payTrackerRoutes from "./routes/payTracker.js";

//mt Initialize Express app
const app = express();
const PORT = process.env.SERVER_PORT || 5000;

//!      --  Middleware --
// CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500',
    credentials: true
}));

// SESSION Middleware
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true only with HTTPS
        httpOnly: true,
        sameSite: 'lax'
    }
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//!       -- Use routes --
app.use("/api/comments", commentRoutes); // Comment routes (CRUD operations)
app.use("/auth", authRoutes); // Admin login route
app.use("/api/pay-tracker", payTrackerRoutes); // Pay Tracker routes (CRUD operations)


//!       -- Test Routes --

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

//mt Test session
app.get('/test-session', (req, res) => {
    if (!req.session.views) {
        req.session.views = 1;
    } else {
        req.session.views++;
    }

    res.send(`Views: ${req.session.views}`);
});

//mt Admin Check User - check -
app.get('/check-user', (req, res) => {
    // LOG
    console.log("server.js - /check-user: LOGIN SESSION ID:", req.sessionID);
    res.json(req.session.user || null);
});


//mt Admin Dashboard - check -
app.get('/admin', isAdmin, (req, res) => {
    // LOG
    console.log("Admin dashboard accessed by:", req.session.user);
    console.log("server.js - /admin: LOGIN SESSION ID:", req.sessionID);

    res.send('res.send: Admin dashboard working');

});


//!       -- Start server --
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});