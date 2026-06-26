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
    pgm.createTable('tags', {
        id: 'id',
        name: {type: 'text', notNull: true, unique: true},
    });

    pgm.createTable('book_tags', {
        book_id: {
            type: 'integer',
            notNull: true,
            references: '"books"',
            onDelete: 'CASCADE'
        },
        tag_id: {
            type: 'integer',
            notNull: true,
            references: '"tags"',
            onDelete: 'CASCADE'
        }
    });

    pgm.sql('ALTER TABLE book_tags ADD PRIMARY KEY (book_id, tag_id)');

    pgm.sql(`
    INSERT INTO tags (name)
    SELECT DISTINCT unnest(tags) FROM books WHERE tags IS NOT NULL
    ON CONFLICT (name) DO NOTHING;
    `);

    pgm.sql(`
    INSERT INTO book_tags (book_id, tag_id)
    SELECT b.id, t.id
    FROM books b
    CROSS JOIN LATERAL unnest(b.tags) AS tag_name
    JOIN tags t ON t.name = tag_name
    WHERE b.tags IS NOT NULL;
    `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.dropTable('book_tags');
    pgm.dropTable('tags');
};

module.exports = {shorthands, up, down}