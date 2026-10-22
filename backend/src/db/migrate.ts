import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { pool } from './client.js';

const here = dirname(fileURLToPath(import.meta.url));
const sql = await readFile(resolve(here, '../../../infra/postgres/001_schema.sql'), 'utf8');
await pool.query(sql);
console.log('Database schema is up to date.');
await pool.end();
