import pool from '../config/db.js';

export const store_files = async (req, res) => {
    const { hash } = req.body; 
    const detection = 'Bad';

    if (!hash || typeof hash !== 'string') {
        return res.status(400).json({ message: "Hash is required and must be a string" });
    }

    let query, value, checkQuery, checkField;

    if (hash.length === 32) {
        checkQuery = 'SELECT * FROM file_MD5 WHERE md5 = ?';
        checkField = 'md5';
        query = 'INSERT INTO file_MD5 (md5, is_bad) VALUES (?, ?)';
        value = [hash, detection];
    } else if (hash.length === 40) {
        checkQuery = 'SELECT * FROM file_SHA1 WHERE sha1 = ?';
        checkField = 'sha1';
        query = 'INSERT INTO file_SHA1 (sha1, is_bad) VALUES (?, ?)';
        value = [hash, detection];
    } else if (hash.length === 64) {
        checkQuery = 'SELECT * FROM file_SHA256 WHERE sha256 = ?';
        checkField = 'sha256';
        query = 'INSERT INTO file_SHA256 (sha256, is_bad) VALUES (?, ?)';
        value = [hash, detection];
    } else {
        return res.status(400).json({ message: "Invalid hash length" });
    }

    try {
        const [rows] = await pool.query(checkQuery, [hash]);
        if (rows.length > 0) {
            return res.status(200).json({
                hash,
                detection,
                message: "Hash already exists (duplicate entry)",
                skipped: true
            });
        }

        await pool.query(query, value);

        res.status(201).json({
            hash,
            detection,
            message: "Hash stored successfully"
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
};
