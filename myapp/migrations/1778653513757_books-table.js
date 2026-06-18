/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const up = (pgm) => {
  pgm.sql(`
    ALTER TABLE books
    ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (to_tsvector('english', title)) STORED;
  `);

  // Performance safeguard: A tsvector column without a GIN index is useless for fast searches.
  pgm.createIndex('books', 'search_vector', {
    method: 'gin'
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
  pgm.dropIndex('books', 'search_vector');
  pgm.dropColumn('books', 'search_vector');
};

module.exports = { up, down};