import Database from 'better-sqlite3';
import * as createAuditsTable from './migrations/001_create_audits_table';

interface Migration {
  id: string;
  up: (db: Database.Database) => void;
}

interface MigrationRow {
  id: string;
}

const migrations: Migration[] = [createAuditsTable];

/**
 * Runs any pending migrations against the given database, tracking applied
 * migrations in a `migrations` table so each migration only runs once.
 */
export function runMigrations(db: Database.Database): void {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS migrations (
      id TEXT PRIMARY KEY,
      applied_at TEXT NOT NULL
    )`
  ).run();

  const appliedIds = new Set(
    (db.prepare('SELECT id FROM migrations').all() as MigrationRow[]).map((row) => row.id)
  );

  for (const migration of migrations) {
    if (!appliedIds.has(migration.id)) {
      migration.up(db);
      db.prepare('INSERT INTO migrations (id, applied_at) VALUES (?, ?)').run(
        migration.id,
        new Date().toISOString()
      );
    }
  }
}
