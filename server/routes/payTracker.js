import express from "express";
import { v4 as uuidv4 } from "uuid";
import db from "../db.js";
import isAdmin from "../middleware/isAdmin.js";

const router = express.Router();

// GET all pay tables
router.get("/tables", isAdmin, (req, res) => {
    try {
        const tables = db.prepare(`
            SELECT * FROM pay_tables
            ORDER BY createdAt DESC
        `).all();

        res.json(tables);
    } catch (err) {
        console.error("GET PAY TABLES ERROR:", err);
        res.status(500).json({ error: "Failed to load pay tables" });
    }
});

// CREATE new pay table
router.post("/tables", isAdmin, (req, res) => {
    try {
        const { tableName } = req.body;

        if (!tableName || !tableName.trim()) {
            return res.status(400).json({ error: "Table name is required" });
        }

        const id = uuidv4();
        const createdAt = new Date().toISOString();

        db.prepare(`
            INSERT INTO pay_tables (id, tableName, createdAt)
            VALUES (?, ?, ?)
        `).run(id, tableName.trim(), createdAt);

        res.json({
            id,
            tableName: tableName.trim(),
            createdAt
        });
    } catch (err) {
        console.error("CREATE PAY TABLE ERROR:", err);
        res.status(500).json({ error: "Failed to create pay table" });
    }
});


//mt  GET rows for one table
router.get("/tables/:tableId/rows", isAdmin, (req, res) => {
    try {
        const { tableId } = req.params;

        const rows = db.prepare(`
            SELECT * FROM pay_table_rows
            WHERE tableId = ?
            ORDER BY createdAt ASC
        `).all(tableId);

        res.json(rows);
    } catch (err) {
        console.error("GET PAY ROWS ERROR:", err);
        res.status(500).json({ error: "Failed to load rows" });
    }
});

//mt  SAVE one row
router.post("/tables/:tableId/rows", isAdmin, (req, res) => {
    try {
        const { tableId } = req.params;
        const {
            workerName,
            dailyPay,
            dayValues,
            totalDays,
            cashTotal
        } = req.body;

        const id = uuidv4();
        const createdAt = new Date().toISOString();

        db.prepare(`
            INSERT INTO pay_table_rows (
                id,
                tableId,
                workerName,
                dailyPay,
                dayValues,
                totalDays,
                cashTotal,
                createdAt
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            id,
            tableId,
            workerName || "",
            Number(dailyPay) || 0,
            JSON.stringify(dayValues || []),
            Number(totalDays) || 0,
            Number(cashTotal) || 0,
            createdAt
        );

        res.json({ message: "Row saved successfully", id });
    } catch (err) {
        console.error("SAVE PAY ROW ERROR:", err);
        res.status(500).json({ error: "Failed to save row" });
    }
});


//mt  UPDATE all rows for a table (full replace)
router.put("/tables/:tableId/rows", isAdmin, (req, res) => {
    try {
        const { tableId } = req.params;
        const { rows } = req.body;

        if (!Array.isArray(rows)) {
            return res.status(400).json({ error: "Rows array is required" });
        }

        // remove old rows for this table
        db.prepare(`
            DELETE FROM pay_table_rows
            WHERE tableId = ?
        `).run(tableId);

        // insert the fresh full set
        const insertRow = db.prepare(`
            INSERT INTO pay_table_rows (
                id,
                tableId,
                workerName,
                dailyPay,
                dayValues,
                totalDays,
                cashTotal,
                isPaid,
                paidAmount,
                createdAt
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const row of rows) {
            insertRow.run(
                uuidv4(),
                tableId,
                row.workerName || "",
                Number(row.dailyPay) || 0,
                JSON.stringify(row.dayValues || []),
                Number(row.totalDays) || 0,
                Number(row.cashTotal) || 0,
                row.isPaid ? 1 : 0,
                Number(row.paidAmount) || 0,
                new Date().toISOString()
            );
        }

        res.json({ message: "Rows updated successfully" });
    } catch (err) {
        console.error("UPDATE PAY ROWS ERROR:", err);
        res.status(500).json({ error: "Failed to update rows" });
    }
});

//mt  DELETE a table and its rows
router.delete("/tables/:tableId", isAdmin, (req, res) => {
    try {
        const { tableId } = req.params;

        // delete rows first
        db.prepare(`
            DELETE FROM pay_table_rows
            WHERE tableId = ?
        `).run(tableId);

        // delete table
        const result = db.prepare(`
            DELETE FROM pay_tables
            WHERE id = ?
        `).run(tableId);

        if (result.changes === 0) {
            return res.status(404).json({ error: "Table not found" });
        }

        res.json({ message: "Table deleted successfully" });
    } catch (err) {
        console.error("DELETE PAY TABLE ERROR:", err);
        res.status(500).json({ error: "Failed to delete table" });
    }
});

export default router;