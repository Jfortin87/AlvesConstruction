//mt Database setup using better-sqlite3
// const Database = require("better-sqlite3");
import Database from "better-sqlite3";

//mt  Create or open database
// const db = new Database("comments.db");
const db = new Database(process.env.DB_Reviews || "comments.db");

//mt Create table if it doesn't exist
db.prepare(`
  CREATE TABLE IF NOT EXISTS comments (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    comment TEXT NOT NULL,
    rating INTEGER NOT NULL,
    isCustomer BOOLEAN NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT,
    editToken TEXT NOT NULL
  )
`).run();

// =============================
//mt PAY TABLES (TABLE)
// =============================
db.prepare(`
  CREATE TABLE IF NOT EXISTS pay_tables (
    id TEXT PRIMARY KEY,
    tableName TEXT NOT NULL,
    createdAt TEXT NOT NULL
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS pay_table_rows (
    id TEXT PRIMARY KEY,
    tableId TEXT NOT NULL,
    workerName TEXT,
    dailyPay REAL DEFAULT 0,
    dayValues TEXT DEFAULT '[]',
    totalDays REAL DEFAULT 0,
    cashTotal REAL DEFAULT 0,
    createdAt TEXT NOT NULL
  )
`).run();



//mt Export database
export default db;