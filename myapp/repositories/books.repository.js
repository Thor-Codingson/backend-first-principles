const pool = require('../db');

async function findAll({ page, limit, sortBy, sortOrder, author }) {
  // 1. Build WHERE clause + params dynamically
  let whereClause = '';
  const params = [];

  if (author) {
    params.push(`%${author}%`);
    whereClause = `WHERE author ILIKE $${params.length}`;
  }

  // 2. Whitelist sort column + direction
  const ALLOWED_SORT = ['title', 'author', 'created_at'];
  const column = ALLOWED_SORT.includes(sortBy) ? sortBy : 'created_at';
  const direction = sortOrder === 'asc' ? 'ASC' : 'DESC';

  // 3. Count query (use whereClause + params)

  const countResult = await pool.query(
    `SELECT COUNT(*)::int AS total FROM books ${whereClause}`,
    params
  );

  const total = countResult.rows[0].total;

  // 4. Data query (whereClause + ORDER BY + LIMIT + OFFSET)
  //    Add limit and offset to params array, use $${params.length} for placeholders
  params.push(limit);
  const limitPlaceholder = `$${params.length}`;

  const offset = (page - 1) * limit;
  params.push(offset);
  const offsetPlaceholder = `$${params.length}`

  const {rows} = await pool.query(
    `SELECT * FROM books ${whereClause} ORDER BY ${column} ${direction} LIMIT ${limitPlaceholder} OFFSET ${offsetPlaceholder}`,
    params
  );

  // 5. Return { items, total }
  return { items: rows, total}
}

async function findById(id) {
  // return books.find(book => book.id === id)
  const { rows } = await pool.query(
    'SELECT * FROM books WHERE id = $1',[id]
  )

  return rows[0];
}

async function insert(book) {
  const {rows} = await pool.query(
    'INSERT INTO books (title, author, tags) VALUES ($1, $2, $3) RETURNING *',[book.title, book.author, book.tags || []]
  );

  return rows[0];
}

async function update(id, book) {
  const ALLOWED_FIELDS = ['title', 'author', 'tags'];
  const fields = Object.keys(book).filter(f => ALLOWED_FIELDS.includes(f));

  if (fields.length === 0) {
    throw new Error('No valid fields to update');
  }

  const values = fields.map(f => book[f]);

  const setClause = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(', ');

  const { rows } = await pool.query(
    `UPDATE books SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`,
    [...values, id]
  );

  return rows[0];
}

async function findByTitle(searchTerm) {
  const { rows } = await pool.query(
    `SELECT id, title, author, created_at,
      ts_rank(search_vector, query) AS rank
    FROM books, plainto_tsquery('english', $1) query
    WHERE search_vector @@ query
    ORDER BY rank DESC
    LIMIT 50`,
    [searchTerm]
  )

  return rows;
}

module.exports = { findAll, findById, insert, update, findByTitle }

/*
const books = [
  { id: 1, title: 'Clean Code', author: 'Robert Martin', tags: ['programming'], created_at: '2024-01-15' },
  { id: 2, title: 'Designing Data-Intensive Apps', author: 'Martin Kleppmann', tags: ['systems', 'databases'], created_at: '2024-02-20' },
  { id: 3, title: 'The Pragmatic Programmer', author: 'David Thomas', tags: ['programming', 'career'], created_at: '2024-03-10' },
];
*/

// function findAll({ page, limit, sortBy, sortOrder, author }) {
//   let result = books;

//   if (author) {
//     result = result.filter(b => b.author.toLowerCase().includes(author.toLowerCase()));
//   }

//   // Step 2: SORT
//   result = [...result].sort((a, b) => {
//     const aVal = a[sortBy];
//     const bVal = b[sortBy];
//     if (sortOrder === 'asc') return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
//     return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
//   });

//   // Step 3: capture total BEFORE pagination
//   const total = result.length;

//   // Step 4: PAGINATE
//   const startIndex = (page - 1) * limit;
//   const items = result.slice(startIndex, startIndex + limit);

//   return { items, total };
// }

// function insert(book) {
//   /* Without DB Connection(on hard coded array)
//   const newBook = {
//   id: books.length + 1,
//   ...book,
//   tags: book.tags || [],
//   created_at: new Date().toISOString()
//   };

//   books.push(newBook)
//   return newBook;
//   */
// }