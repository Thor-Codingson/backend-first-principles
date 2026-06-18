const shorthands = undefined;

const up = (pgm) => {
  pgm.sql(`
    ALTER TABLE books
    ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (to_tsvector('english', coalesce(title, ''))) STORED;
  `);
  pgm.createIndex('books', 'search_vector', { method: 'gin' });
};

const down = (pgm) => {
  pgm.dropIndex('books', 'search_vector');
  pgm.dropColumn('books', 'search_vector');
};

module.exports = { shorthands, up, down };