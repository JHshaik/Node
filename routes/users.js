import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM users");
        res.json(rows);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

router.post("/", async (req, res) => {
    try {
        const { full_name, email, password, phone, apartment_no, role } = req.body;
        if (!full_name || !email) {
            return res.status(400).json({ error: "Name and email are required" });
        }

        const [result] = await pool.query(
            "INSERT INTO users (full_name, email, password, phone, apartment_no, role) VALUES (?, ?, ?, ?, ?, ?)",
            [full_name, email, password, phone, apartment_no, role]
        );

        res.status(201).json({
            message: "User created successfully",
            userId: result.insertId,
        });
    } catch (err) {
        console.error("Error adding user:", err);
        res.status(500).json({ error: "Failed to create user" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, password, phone, apartment_no, role } = req.body;

        const [result] = await pool.query(
            "UPDATE users SET full_name = ?, email = ?, password = ?, phone = ?, apartment_no = ?, role = ? WHERE id = ?",
            [full_name, email, password, phone, apartment_no, role, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User updated successfully" });
    } catch (err) {
        console.error("Error updating user:", err);
        res.status(500).json({ error: "Failed to update user" });
    }
});


router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            "DELETE FROM users where id = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
        console.error("Error deleting user:", err);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

export default router;
