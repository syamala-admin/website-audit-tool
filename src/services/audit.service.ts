import { AuditRepository } from '../repositories/audit.repository';
import { AuditRecord } from '../interfaces/audit.interface';

const MAX_RECENT_AUDITS = 10;

/**
 * Service: encapsulates audit persistence/retrieval business rules
 * (e.g. capping and ordering the recent audits list).
 */
export class AuditService {
  private readonly repository: AuditRepository;

  constructor(repository: AuditRepository) {
    this.repository = repository;
  }

  recordAudit(url: string, issueCount: number): AuditRecord {
    const createdAt = new Date().toISOString();
    return this.repository.insert(url, issueCount, createdAt);
  }

  getRecentAudits(limit: number = MAX_RECENT_AUDITS): AuditRecord[] {
    const safeLimit = Math.min(limit, MAX_RECENT_AUDITS);
    return this.repository.findRecent(safeLimit);
  }

  deleteAudit(id: number): boolean {
    return this.repository.deleteById(id);
  }

  getAuditCount(): number {
    return this.repository.count();
  }
}
