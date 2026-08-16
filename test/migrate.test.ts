import Database from 'better-sqlite3';
import { runMigrations } from '../src/db/migrate';

// Unit/integration coverage, using the authorized Jest stack (no separate
// e2e framework is introduced), for the idempotent-migration fix in
// src/db/migrate.ts: running migrations a second time against an
// already-migrated database must not throw a UNIQUE constraint error and
// must not duplicate rows in the migrations table.

describe('runMigrations idempotency', () => {
  it('does not throw and does not duplicate migration records when run twice on the same database', () => {
    const db = new Database(':memory:');

    try {
      expect(() => runMigrations(db)).not.toThrow();

      // Second run simulates re-running migrations against an
      // already-migrated database (e.g. concurrent app boots / parallel
      // test workers). It must be a safe no-op, not a thrown error.
      expect(() => runMigrations(db)).not.toThrow();

      const rows = db.prepare('SELECT id FROM migrations').all() as Array<{ id: string }>;
      const ids = rows.map((row) => row.id);
      const uniqueIds = new Set(ids);

      expect(ids.length).toBe(uniqueIds.size);
    } finally {
      db.close();
    }
  });
});
