import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { pool } from './client.js';

const here = dirname(fileURLToPath(import.meta.url));
const sql = await readFile(resolve(here, '../../../../infra/postgres/002_seed.sql'), 'utf8');
await pool.query(sql);
console.log('Demo data loaded.');
await pool.end();
