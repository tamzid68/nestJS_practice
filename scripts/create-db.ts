import { Client } from 'pg';

async function createDatabase() {
  const user = process.env.DB_USER || 'postgres';
  const host = process.env.DB_HOST || 'localhost';
  const database = process.env.DB_NAME || 'UniversityDB';
  const password = process.env.DB_PASSWORD || 'asm_tamzid';
  const port = parseInt(process.env.DB_PORT || '5432', 10);

  // Connect to the default 'postgres' database to run CREATE DATABASE
  const client = new Client({
    user,
    host,
    database: 'postgres',
    password,
    port,
  });

  try {
    await client.connect();
    // Check if DB exists
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname=$1`, [database]);
    if (res.rowCount > 0) {
      console.log(`Database '${database}' already exists`);
    } else {
      await client.query(`CREATE DATABASE "${database}"`);
      console.log(`Created database '${database}'`);
    }
  } catch (err) {
    console.error('Failed to create database:', err);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

createDatabase();
