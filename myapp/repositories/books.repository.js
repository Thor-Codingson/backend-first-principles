const books = [
  { id: 1, title: 'Clean Code', author: 'Robert Martin', tags: ['programming'], created_at: '2024-01-15' },
  { id: 2, title: 'Designing Data-Intensive Apps', author: 'Martin Kleppmann', tags: ['systems', 'databases'], created_at: '2024-02-20' },
  { id: 3, title: 'The Pragmatic Programmer', author: 'David Thomas', tags: ['programming', 'career'], created_at: '2024-03-10' },
];

function findAll(filters = {}) {
  let result = books;

  if (filters.author) {
    result = books.filter(book => book.author.toLowerCase().includes(filters.author.toLowerCase()))
  }

  const filteredBooks = result.map(book => {
    return {
      id: book.id,
      title: book.title,
      author: book.author
    }
  });

  return filteredBooks;
}

function findById(id) {
  return books.find(book => book.id === id)
}

function insert(book) {

  const newBook = {
  id: books.length + 1,
  ...book,
  tags: book.tags || [],
  created_at: new Date().toISOString()
  };

  books.push(newBook)
  return newBook;
}

module.exports = { findAll, findById, insert }