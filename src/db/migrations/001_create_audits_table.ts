import Database from 'better-sqlite3';

/**
 * Migration: creates the audits table.
 * Schema changes must always ship as a migration, never as hand-edited DDL
 * executed inline from application/repository code.
 */
export const id = '001_create_audits_table';

export function up(db: Database.Database): void {
  db.prepare(
    `CREATE TABLE IF NOT EXISTS audits (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      url TEXT NOT NULL,
      issue_count INTEGER NOT NULL,
      created_at TEXT NOT NULL
    )`
  ).run();
}
