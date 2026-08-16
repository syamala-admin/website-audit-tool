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
      // INSERT OR IGNORE: recording an already-applied migration (e.g. a
      // concurrent run, as parallel tests can trigger) must be a safe
      // no-op rather than throwing a UNIQUE constraint error.
      db.prepare('INSERT OR IGNORE INTO migrations (id, applied_at) VALUES (?, ?)').run(
        migration.id,
        new Date().toISOString()
      );
    }
  }
}
