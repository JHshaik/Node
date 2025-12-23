import { pool } from '../db.js';

const validateSession = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "Session ID is required" });
        }

        const [session] = await pool.query("SELECT * FROM sessions WHERE sessionId = ?", [authHeader]);

        if (session.length === 0) {
            return res.status(401).json({ message: "Invalid or expired session ID" });
        }

        const foundSession = session[0];

        if (foundSession.expiresAt < Date.now()) {
            await pool.query("DELETE FROM sessions WHERE sessionId = ?", [authHeader]);
            return res.status(401).json({ message: "Session has expired" });
        }

        req.userId = foundSession.userId;
        next();
    } catch (err) {
        console.error("Error in session validation middleware:", err);
        res.status(500).json({ message: "Failed to validate session" });
    }
};

export default validateSession;
