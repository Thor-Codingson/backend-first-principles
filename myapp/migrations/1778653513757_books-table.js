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
    pgm.createTable('books', {
    // columns go here
    id: 'id',
    title: {type: 'text', notNull: true},
    author: {type: 'text', notNull: true},
    tags: {type: 'text[]', notNull: true, default: '{}'},
    created_at: {type: 'timestamptz', notNull: true, default: pgm.func('current_timestamp')}
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.dropTable('books')
};

module.exports = { up, down};