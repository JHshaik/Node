import express from "express";
import { pool } from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * FROM requests");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});


router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const [result] = pool.query("DELETE FROM requests WHERE id = ?", [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "requests not found" });
        }

        res.status(200).json({ message: "requests Deleted Successfully" });
    } catch (res) {
        res.status(500).json({ error: "Server Error" });
    }
})

export default router;