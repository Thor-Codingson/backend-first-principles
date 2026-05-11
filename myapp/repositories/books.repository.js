const books = [
  { id: 1, title: 'Clean Code', author: 'Robert Martin', tags: ['programming'], created_at: '2024-01-15' },
  { id: 2, title: 'Designing Data-Intensive Apps', author: 'Martin Kleppmann', tags: ['systems', 'databases'], created_at: '2024-02-20' },
  { id: 3, title: 'The Pragmatic Programmer', author: 'David Thomas', tags: ['programming', 'career'], created_at: '2024-03-10' },
];

function findAll({ page, limit, sortBy, sortOrder, author }) {
  let result = books;

  if (author) {
    result = result.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
  }

  // Step 2: SORT
  result = [...result].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
    if (sortOrder === 'asc') return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
  });

  // Step 3: capture total BEFORE pagination
  const total = result.length;

  // Step 4: PAGINATE
  const startIndex = (page - 1) * limit;
  const items = result.slice(startIndex, startIndex + limit);

  return { items, total };
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