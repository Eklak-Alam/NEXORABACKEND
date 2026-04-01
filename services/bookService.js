const BookModel = require('../models/bookModel');
const crypto = require('crypto'); // Built-in Node.js module

class BookService {
    static async fetchBooks(searchQuery) {
        return await BookModel.getAllOrSearch(searchQuery);
    }

    // UPDATED: Generate UUID here
    static async addBook(bookData) {
        const { title, author } = bookData;
        if (!title || !author) {
            throw new Error('Title and Author are required fields.');
        }
        
        // Generate a random UUID (e.g., '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed')
        const newId = crypto.randomUUID(); 
        
        // Pass the newId to the model
        await BookModel.create(newId, title, author);
        
        return { id: newId, title, author, is_read: false };
    }

    static async toggleReadStatus(id, is_read) {
        const existingBook = await BookModel.getById(id);
        if (!existingBook) {
            throw new Error('Book not found.');
        }

        await BookModel.updateStatus(id, is_read);
        return { message: 'Book status updated successfully.' };
    }

    static async removeBook(id) {
        const existingBook = await BookModel.getById(id);
        if (!existingBook) {
            throw new Error('Book not found.');
        }

        await BookModel.delete(id);
        return { message: 'Book deleted successfully.' };
    }
}

module.exports = BookService;