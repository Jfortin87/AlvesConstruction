//!    --------   SERVER/routes/ comments.js    ----------
//mt  Comments API routes

//mt Imports
import express from "express";
import { v4 as uuidv4 } from "uuid";
import sanitizeHtml from "sanitize-html";
import db from "../db.js";

//mt Create router
const router = express.Router();

//mt Fake fallback comments
const fakeComments = [
    {
        id: "fake-1",
        name: "Mike R",
        comment: "Amazing craftsmanship. Highly recommend!",
        rating: 92,
        isCustomer: 1,
        createdAt: new Date().toISOString()
    },
    {
        id: "fake-2",
        name: "Sarah L",
        comment: "Very professional and on time.",
        rating: 88,
        isCustomer: 1,
        createdAt: new Date().toISOString()
    },
    {
        id: "fake-3",
        name: "Sa Lee",
        comment: "Very professional and on time.",
        rating: 98,
        isCustomer: 0,
        createdAt: new Date().toISOString()
    },
    {
        id: "fake-4",
        name: "Rah Rally",
        comment: "Very professional and on time.",
        rating: 68,
        isCustomer: 1,
        createdAt: new Date().toISOString()
    }
];


//mt  GET ALL  comments (-- GET ALL -- From DB, fallback to fake if empty)
// localhost:3000/api/comments
router.get("/", (req, res) => {
    const comments = db.prepare("SELECT * FROM comments ORDER BY createdAt DESC").all();

    if (comments.length === 0) {
        return res.json(fakeComments);
    }

    res.json(comments);
});


//mt CREATE/ POST   comment    (-- POST -- Validate, sanitize, check duplicates, insert into DB)
// localhost:3000/api/comments
router.post("/", (req, res) => {
    let { name, comment, rating, isCustomer } = req.body;

    // 🔒 Validation
    if (!name || !comment || rating === undefined || isCustomer === undefined) {
        return res.status(400).json({ error: "All fields are required" });
    }

    if (rating < 1 || rating > 100) {
        return res.status(400).json({ error: "Rating must be 1-100" });
    }

    // 🧼 Sanitize
    name = sanitizeHtml(name.trim());
    comment = sanitizeHtml(comment.trim());

    // 🚫 Duplicate spam protection (last 5 mins)
    const duplicate = db.prepare(`
    SELECT * FROM comments
    WHERE name = ? AND comment = ?
    AND createdAt > datetime('now', '-5 minutes')
  `).get(name, comment);

    if (duplicate) {
        return res.status(409).json({ error: "Duplicate comment detected" });
    }

    //st Insert into DB
    const id = uuidv4();
    const editToken = uuidv4();
    const createdAt = new Date().toISOString();

    //st Use prepared statement for insertion
    db.prepare(`
    INSERT INTO comments (id, name, comment, rating, isCustomer, createdAt, editToken)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(id, name, comment, rating, isCustomer ? 1 : 0, createdAt, editToken);

    res.json({
        id,
        name,
        comment,
        rating,
        isCustomer: Boolean(isCustomer),
        createdAt,
        editToken // IMPORTANT for editing/deleting
    });
});

//mt PUT/ UPDATE    (-- PUT -- Validate, sanitize, check token, 24h rule, update in DB)
// localhost:3000/api/comments/:id
router.put("/:id", (req, res) => {
    try {
        const { id } = req.params;
        let { comment, rating, isCustomer, editToken } = req.body;

        // 🔒 Validation
        if (!comment || rating === undefined || isCustomer === undefined || !editToken) {
            return res.status(400).json({ error: "All fields required" });
        }

        if (rating < 1 || rating > 100) {
            return res.status(400).json({ error: "Rating must be 1-100" });
        }

        // 🧼 Sanitize
        comment = sanitizeHtml(comment.trim());

        const existing = db.prepare("SELECT * FROM comments WHERE id = ?").get(id);

        if (!existing) {
            return res.status(404).json({ error: "Comment not found" });
        }

        // 🔐 Check token
        if (existing.editToken !== editToken) {
            return res.status(403).json({ error: "Invalid edit token" });
        }

        // ⏱️ 24-hour rule
        const now = new Date();
        const created = new Date(existing.createdAt);
        const hoursDiff = (now - created) / (1000 * 60 * 60);

        if (hoursDiff > 24) {
            return res.status(403).json({ error: "Edit window expired (24h)" });
        }

        const updatedAt = new Date().toISOString();

        db.prepare(`
      UPDATE comments
      SET comment = ?, rating = ?, isCustomer = ?, updatedAt = ?
      WHERE id = ?
    `).run(
            comment,
            rating,
            isCustomer ? 1 : 0,
            updatedAt,
            id
        );

        res.json({ message: "Comment updated successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});



//mt DELETE/ REMOVE    (-- DELETE -- Check token, delete from DB)
// localhost:3000/api/comments/:id
router.delete("/:id", (req, res) => {
    try {
        const { id } = req.params;
        const { editToken } = req.body;

        if (!editToken) {
            return res.status(400).json({ error: "Edit token required" });
        }

        const existing = db.prepare("SELECT * FROM comments WHERE id = ?").get(id);

        if (!existing) {
            return res.status(404).json({ error: "Comment not found" });
        }

        if (existing.editToken !== editToken) {
            return res.status(403).json({ error: "Invalid edit token" });
        }

        db.prepare("DELETE FROM comments WHERE id = ?").run(id);

        res.json({ message: "Comment deleted successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

//mt Export router
export default router;