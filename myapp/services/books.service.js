const booksRepo = require('../repositories/books.repository')

function getAllBooks(authorQuery) {
    return booksRepo.findAll({ author: authorQuery });
}

function getBookById(id) {
    const book = booksRepo.findById(id)

    if (!book) { const e = new Error(`Book ${id} not found`); e.name = 'NotFoundError'; throw e; }

    return book;
}

function newBook(book) {
    const data = {
        ...book,
        tags: book.tags || []
    }

    return booksRepo.insert(data)
}

module.exports = { getAllBooks, getBookById, newBook }