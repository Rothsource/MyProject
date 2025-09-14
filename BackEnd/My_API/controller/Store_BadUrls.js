import pool from '../config/db.js';

export const store_url = async (req, res) => {
    const { url, hash } = req.body;  
    const detection = 'Bad';

    try {
        await pool.query(
            'INSERT INTO Malicious_Link(URL, hahs_256, is_bad) VALUES (?, ?, ?)',
            [url, hash, detection]
        );

        res.status(201).json({
            url,
            hash,
            detection,
            message: "URL stored successfully"
        });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            console.log(`Duplicate hash found for URL: ${url}`);
            return res.status(200).json({
                url,
                hash,
                detection,
                message: "URL already exists (duplicate hash)",
                skipped: true
            });
        }

        console.error("Database error:", error);
        res.status(500).json({ 
            message: "Internal server error", 
            error: error.message 
        });
    }
};
