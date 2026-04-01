const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'book_tracker',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const initDB = async () => {
    try {
        const query = `
            CREATE TABLE IF NOT EXISTS books (
                id VARCHAR(36) PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                author VARCHAR(255) NOT NULL,
                is_read BOOLEAN DEFAULT false,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        await pool.query(query);
        console.log('✅ Database connected & "books" table with UUID is ready!');
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        process.exit(1); 
    }
};

module.exports = { pool, initDB };