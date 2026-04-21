//!  -- Imports --
import express from "express";
import bcrypt from "bcrypt";

//mt Create router
const router = express.Router();



//@    -- Temporary admin user
const adminUser = {
    email: 'admin@test.com',
    password: bcrypt.hashSync('1234', 10),
    role: 'admin'
};

//!       -- Test Routes --

//mt  POST/  Login
// http://localhost:3000/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (email !== adminUser.email) {
        return res.status(401).send('Invalid email');
    }

    const match = await bcrypt.compare(password, adminUser.password);

    if (!match) {
        return res.status(401).send('Invalid password');
    }

    // Save user in session
    req.session.user = {
        email: adminUser.email,
        role: adminUser.role
    };

    // FORCE session save before responding
    req.session.save((err) => {
        if (err) {
            console.log("Session save error:", err);
            return res.status(500).send('Session error');
        }

        //* LOG
        console.log("LOGIN ROUTE HIT");
        console.log("auth.js- /login: LOGIN SESSION ID:", req.sessionID);

        res.send('Logged in');
    });
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log("Logout error:", err);
            return res.status(500).send("Logout failed");
        }

        res.clearCookie("connect.sid");
        res.send("Logged out");
    });
});


//! Export router
export default router;