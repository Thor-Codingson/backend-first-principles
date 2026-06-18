const redis = require('../redis');
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

  let book = await redis.get(`book:${id}`)

  if (book) {
    return JSON.parse(book);
  }

  book = await booksRepo.findById(id)
  if (!book) { const e = new Error(`Book ${id} not found`); e.name = 'NotFoundError'; throw e; }

  await redis.set(`book:${id}`, JSON.stringify(book), 'EX', 300)
  return book;
}

async function updateBook(id, book) {
  const updated = await booksRepo.update(id, book);
  await redis.del(`book:${id}`);

  return updated;
}

async function newBook(id, book) {
    const data = {
        ...book,
        tags: book.tags || []
    }

    return await booksRepo.insert(data)
}

async function searchResult(searchTerm) {
  let books = await booksRepo.findByTitle(searchTerm);

  if (!books) { const e = new Error(`Book ${searchTerm} not found`); e.name = 'NotFoundError'; throw e; }

  return books;
}

module.exports = { getAllBooks, getBookById, newBook, updateBook, searchResult }