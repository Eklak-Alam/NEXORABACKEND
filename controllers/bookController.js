const BookService = require('../services/bookService');

// Standardized response format
const sendResponse = (res, statusCode, success, data = null, message = null) => {
    res.status(statusCode).json({ success, data, message });
};

class BookController {
    // GET /api/books?search=harry
    static async getBooks(req, res) {
        try {
            const searchQuery = req.query.search;
            const books = await BookService.fetchBooks(searchQuery);
            sendResponse(res, 200, true, books);
        } catch (error) {
            sendResponse(res, 500, false, null, 'Failed to fetch books');
        }
    }

    // POST /api/books
    static async createBook(req, res) {
        try {
            const newBook = await BookService.addBook(req.body);
            sendResponse(res, 201, true, newBook, 'Book added successfully');
        } catch (error) {
            // Handle validation errors from the service
            const statusCode = error.message.includes('required') ? 400 : 500;
            sendResponse(res, statusCode, false, null, error.message);
        }
    }

    // PUT /api/books/:id
    static async updateBook(req, res) {
        try {
            const { id } = req.params;
            const { is_read } = req.body;
            const result = await BookService.toggleReadStatus(id, is_read);
            sendResponse(res, 200, true, null, result.message);
        } catch (error) {
            const statusCode = error.message.includes('not found') ? 404 : 500;
            sendResponse(res, statusCode, false, null, error.message);
        }
    }

    // DELETE /api/books/:id
    static async deleteBook(req, res) {
        try {
            const { id } = req.params;
            const result = await BookService.removeBook(id);
            sendResponse(res, 200, true, null, result.message);
        } catch (error) {
            const statusCode = error.message.includes('not found') ? 404 : 500;
            sendResponse(res, statusCode, false, null, error.message);
        }
    }
}

module.exports = BookController;