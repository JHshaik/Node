import express from "express";
import { pool } from "../db.js";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;

        const [user] = await pool.query(
            "SELECT * FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const foundUser = user[0];
        const userPassword = password.trim();
        const hashPassword = foundUser.password.trim();

        const isMatch = await userPassword === hashPassword;

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const sessionId = uuidv4();

        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
        await pool.query(
            "INSERT INTO sessions (sessionId, userId, expiresAt) VALUES (?, ?, ?)",
            [sessionId, foundUser.id, expiresAt]
        );
        const date = new Date(expiresAt).toISOString().split('T')[0];

        res.json({
            message: "Login successful",
            sessionId,
            date
        });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

export default router;