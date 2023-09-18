import { Pool } from 'pg';

const db_properties = {
  "user":"postgres",
  "password":"qwerty",
  "host":"localhost",
  "database":"first_project",
  "port":5432
};

const pool = new Pool({
  user: db_properties.user,
  password: db_properties.password,
  host: db_properties.host,
  database: db_properties.database,
  port: db_properties.port
})

async function initDb(): Promise<void> {
  await createTables();
  await runMigrations();
}

async function createTables(): Promise<void> {
  await pool.query(
    `CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE,
        password TEXT,
        refresh_token TEXT
        );`
  );

  await pool.query(
    `CREATE TABLE IF NOT EXISTS roles (
        id SERIAL PRIMARY KEY,
        name TEXT
        );`
  );
}

async function runMigrations(): Promise<void> {
  const result = await pool.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role_id'`
  );
  if (result.rows.length === 0) {
    await pool.query(
      `ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES roles(id)`
    );
  }
}

export { pool, initDb };
