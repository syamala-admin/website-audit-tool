import Database from 'better-sqlite3';
import { AuditRecord } from '../interfaces/audit.interface';

interface AuditRow {
  id: number;
  url: string;
  issueCount: number;
  createdAt: string;
}

/**
 * Repository: isolates SQLite access for audit records from business logic.
 * Schema is managed exclusively via migrations (see src/db/migrate.ts);
 * this repository assumes the `audits` table already exists.
 */
export class AuditRepository {
  private readonly db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
  }

  insert(url: string, issueCount: number, createdAt: string): AuditRecord {
    const result = this.db
      .prepare('INSERT INTO audits (url, issue_count, created_at) VALUES (?, ?, ?)')
      .run(url, issueCount, createdAt);

    return {
      id: Number(result.lastInsertRowid),
      url,
      issueCount,
      createdAt,
    };
  }

  findRecent(limit: number): AuditRecord[] {
    const rows = this.db
      .prepare(
        'SELECT id, url, issue_count as issueCount, created_at as createdAt FROM audits ORDER BY created_at DESC, id DESC LIMIT ?'
      )
      .all(limit) as AuditRow[];

    return rows.map((row) => ({
      id: row.id,
      url: row.url,
      issueCount: row.issueCount,
      createdAt: row.createdAt,
    }));
  }

  deleteById(id: number): boolean {
    const result = this.db
      .prepare('DELETE FROM audits WHERE id = ?')
      .run(id);

    return (result.changes ?? 0) > 0;
  }

  count(): number {
    const row = this.db.prepare('SELECT COUNT(*) as count FROM audits').get() as { count: number };
    return row.count;
  }
}
