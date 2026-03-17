import express from "express";
import { pool } from "../db.js";

/**
 * @openapi
 * /apartments:
 *   get:
 *     tags:
 *       - Apartments
 *     summary: Get all apartments
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of apartments
 *   post:
 *     tags:
 *       - Apartments
 *     summary: Create apartment
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               building_name:
 *                 type: string
 *               resident_id:
 *                 type: integer
 *             required:
 *               - building_name
 *               - resident_id
 *     responses:
 *       201:
 *         description: Apartment created
 */

/**
 * @openapi
 * /apartments/{id}:
 *   put:
 *     tags:
 *       - Apartments
 *     summary: Update apartment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Updated
 *   delete:
 *     tags:
 *       - Apartments
 *     summary: Delete apartment
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deleted
 */

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM apartments");
    res.json(rows);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { building_name, apartment_no, floor, block, type, size_sqft, status, resident_id } = req.body;
    if (!building_name || !resident_id) {
      return res.status(400).json({ error: "building_name and resident_id are required" });
    }

    const [result] = await pool.query(
      "INSERT INTO apartments (building_name, apartment_no, floor, block, type, size_sqft, status, resident_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [building_name, apartment_no, floor, block, type, size_sqft, status, resident_id]
    );

    res.status(201).json({
      message: "Apartment created successfully",
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
        const { building_name, apartment_no, floor, block, type, size_sqft, status, resident_id } = req.body;

        const [result] = await pool.query(
            "UPDATE apartments SET building_name = ?, apartment_no = ?, floor = ?, block = ?, type = ?, size_sqft = ?, status = ?, resident_id = ? WHERE id = ?",
            [building_name, apartment_no, floor, block, type, size_sqft, status, resident_id, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "apartment not found" });
        }

        res.status(200).json({ message: "apartment updated successfully" });
    } catch (err) {
        console.error("Error updating apartment:", err);
        res.status(500).json({ error: "Failed to update apartment" });
    }
});


router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      "DELETE FROM apartments where id = ?",
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "apartments not found" });
    }

    res.status(200).json({ message: "apartment deleted successfully" });
  } catch (err) {
    console.error("Error deleting apartments:", err);
    res.status(500).json({ error: "Failed to delete apartments" });
  }
});

export default router;
