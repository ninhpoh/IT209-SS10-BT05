const express = require("express");
const { Pool } = require("pg");

const app = express();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

app.get("/", (req, res) => {
    res.json({ message: "EX5 backend is running" });
});

app.get("/health", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() AS now");
        res.json({ status: "ok", db_time: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ status: "error", error: err.message });
    }
});

app.listen(8080, "0.0.0.0", () => console.log("Backend listening on 8080"));