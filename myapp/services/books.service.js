const booksRepo = require('../repositories/books.repository')

function getAllBooks(options) {
  const { items, total } = booksRepo.findAll(options);

  return {
    data: items,
    total,
    page: options.page,
    totalPages: Math.ceil(total / options.limit),
    limit: options.limit
  };
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