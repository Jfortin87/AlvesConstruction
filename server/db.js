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


//mt Export database
export default db;