const { pool } = require('../config/db');

class BookModel {
    static async getAllOrSearch(searchQuery) {
        let query = 'SELECT * FROM books';
        let values = [];

        if (searchQuery) {
            query += ' WHERE title LIKE ? OR author LIKE ?';
            const searchParam = `%${searchQuery}%`;
            values = [searchParam, searchParam];
        }

        query += ' ORDER BY created_at DESC';
        const [rows] = await pool.query(query, values);
        return rows;
    }

    static async getById(id) {
        const [rows] = await pool.query('SELECT * FROM books WHERE id = ?', [id]);
        return rows[0]; 
    }

    // UPDATED: Now accepts 'id' as a parameter
    static async create(id, title, author) {
        await pool.query(
            'INSERT INTO books (id, title, author) VALUES (?, ?, ?)',
            [id, title, author]
        );
        return id; // Return the UUID back to the service
    }

    static async updateStatus(id, is_read) {
        const [result] = await pool.query(
            'UPDATE books SET is_read = ? WHERE id = ?',
            [is_read, id]
        );
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await pool.query('DELETE FROM books WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = BookModel;