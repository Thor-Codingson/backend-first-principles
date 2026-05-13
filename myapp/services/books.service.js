const booksRepo = require('../repositories/books.repository')

async function getAllBooks(options) {
  const { items, total } = await booksRepo.findAll(options);

  return {
    data: items,
    total,
    page: options.page,
    totalPages: Math.ceil(total / options.limit),
    limit: options.limit
  };
}

async function getBookById(id) {
    const book = await booksRepo.findById(id)

    if (!book) { const e = new Error(`Book ${id} not found`); e.name = 'NotFoundError'; throw e; }

    return book;
}

async function newBook(book) {
    const data = {
        ...book,
        tags: book.tags || []
    }

    return await booksRepo.insert(data)
}

module.exports = { getAllBooks, getBookById, newBook }