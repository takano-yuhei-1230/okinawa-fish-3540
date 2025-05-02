import { execSync } from 'child_process';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const migrationsDir = join(process.cwd(), 'migrations');
const migrations = readdirSync(migrationsDir)
  .filter(file => file.endsWith('.sql'))
  .sort();

const wranglerConfig = require('../wrangler.json');
const dbName = wranglerConfig.database_name;

for (const migration of migrations) {
  console.log(`Running migration: ${migration}`);
  const sql = readFileSync(join(migrationsDir, migration), 'utf-8');

  try {
    execSync(`wrangler d1 execute ${dbName} --file=${join(migrationsDir, migration)}`, {
      stdio: 'inherit',
    });
    console.log(`Migration ${migration} completed successfully`);
  } catch (error) {
    console.error(`Error running migration ${migration}:`, error);
    process.exit(1);
  }
}
