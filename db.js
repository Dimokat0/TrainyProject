const fs = require('fs');
const { Pool } = require('pg');

let db_properties = fs.readFileSync('db_properties.json', 'utf-8');
db_properties = JSON.parse(db_properties);
const pool = new Pool(db_properties);

async function initDb() {
    await createTables();
    await runMigrations();
}

async function createTables() {
    await pool.query(
        `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT,
        password TEXT,
        refresh_token TEXT
        )`
    );

    await pool.query(
        `CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name TEXT
        )`
    );
}

async function runMigrations() {
    const result = await pool.query(
      `SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role_id'`
    );
    if (result.rows.length === 0) {
      await pool.query(
        `ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES roles(id)`
      );
    }
  }

module.exports = { pool, initDb };