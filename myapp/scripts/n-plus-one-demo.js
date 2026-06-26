require('dotenv').config();
const pool = require('../db');

let queryCounter = 0;

async function findAllWithTagsNPlusOne() {

  const booksResult = await pool.query('SELECT * FROM books ORDER BY id');
  const books = booksResult.rows;
  queryCounter++;
  for (const book of books) {
    queryCounter++;
    const tagsResult = await pool.query(`
      SELECT t.id, t.name
      FROM tags t
      JOIN book_tags bt ON t.id = bt.tag_id
      WHERE bt.book_id = $1
    `, [book.id]);

    book.tags = tagsResult.rows.map(row => row.name);
  }
  return books;
}


async function findAllWithTags() {
    queryCounter++;
    const { rows } = await pool.query(
        `
        SELECT b.id, b.title, COALESCE( json_agg(t.name) FILTER (WHERE t.name IS NOT NULL), '[]'::json )
        AS tags
        FROM books b
        LEFT JOIN book_tags bt ON b.id = bt.book_id
        LEFT JOIN tags t ON t.id = bt.tag_id
        GROUP BY b.id
        ORDER BY b.id
        `
    )

    return rows;
}

async function main() {
  const books = await findAllWithTagsNPlusOne();
  console.log(`Total queries: ${queryCounter} after findAllWithTagsNPlusOne`);
  queryCounter = 0;
  console.log(JSON.stringify(books, null, 2));

  const joinBooks = await findAllWithTags();
  console.log(`Total queries: ${queryCounter} after findAllWithTags`);
  console.log(JSON.stringify(joinBooks, null, 2));
  pool.end();
}

main().catch(console.error);