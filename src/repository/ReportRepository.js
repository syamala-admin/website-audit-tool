/**
 * In-memory repository for audit reports. Kept behind a repository
 * interface so it can later be swapped for a persistent store without
 * touching services or controllers.
 */
class ReportRepository {
  constructor() {
    this.reports = new Map();
  }

  save(report) {
    this.reports.set(report.id, report);
    return report;
  }

  findById(id) {
    return this.reports.get(id) || null;
  }

  findAll() {
    return Array.from(this.reports.values());
  }
}

module.exports = new ReportRepository();
