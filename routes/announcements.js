import express from "express";
import { pool } from "../db.js";

const router = express.Router();


router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query("SELECT * from announcements");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch announcements" });
    }
});


router.post('/', async (req, res) => {
    try {
        const { title, message, category, posted_by, target_audience, start_date, end_date, status } = req.body;

        if (!title) {
            return res.status(400).json("Title Is Required");
        }
        console.log(title)

        const [result] = await pool.query("INSERT INTO announcements (title, message, category, posted_by, target_audience, start_date, end_date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ",
            [title, message, category, posted_by, target_audience, start_date, end_date, status]);
        console.log(result)

        res.status(201).json({
            message: "Announcement Created Successfully",
            announcementId: result.insertId
        })
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, message, category, posted_by, target_audience, start_date, end_date, status } = req.body;

        if (!title) {
            return res.status(400).json("Title Is Required");
        }
        console.log(id)
        const [result] = await pool.query(
            "UPDATE announcements SET title = ?, message = ?, category = ?, posted_by = ?, target_audience = ?, start_date = ?, end_date = ?, status = ? WHERE id = ?",
            [title, message, category, posted_by, target_audience, start_date, end_date, status, id]
        );
        console.log(result)
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "apartment not found" });
        }

        res.status(200).json({
            message: "Announcement Updated Successfully"
        });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query("DELETE FROM announcements WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "announcement not found" });
        }

        res.status(200).json({ message: "Announcement Deleted Successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
})

export default router;