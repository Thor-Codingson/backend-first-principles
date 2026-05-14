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
    pgm.createTable('users', {
        id: 'id',
        email: { type: 'text', notNull: true},
        password: {
            type: 'text',
            notNull: true,
        },
        role: {
            type: 'text',
            notNull: true,
            default: 'user',
            check: "role IN ('user', 'admin')"
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('current_timestamp')
        }
    })
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
const down = (pgm) => {
    pgm.dropTable('users');
};

module.exports = { up,down }