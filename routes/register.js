import express from "express";
import { pool } from "../db.js";

const router = express.Router();
router.post("/", async (req, res) => {
    try {
        const { full_name, email, password, phone, apartment_no, role } = req.body;
        if (!full_name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
        }
        const [existingUser] = await pool.query(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const [result] = await pool.query(
            "INSERT INTO users (full_name, email, password, phone, apartment_no, role) VALUES (?, ?, ?, ?, ?, ?)",
            [full_name, email, password, phone, apartment_no, role]
        );

        res.status(201).json({
            message: "Registration successfully Completed",
            userId: result.insertId,
        });
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({ error: "Failed to Register user" });
    }
});

export default router;