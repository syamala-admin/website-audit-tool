'use strict';

/**
 * Builder pattern: accumulates findings from each check and assembles a
 * final, structured audit Report object.
 */
class AuditReportBuilder {
  constructor(url) {
    this.url = url;
    this.findings = [];
    this.startedAt = new Date();
  }

  addFindings(findings = []) {
    findings.forEach((finding) => this.findings.push(finding));
    return this;
  }

  build() {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    const sortedFindings = [...this.findings].sort(
      (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
    );

    const summary = {
      total: sortedFindings.length,
      high: sortedFindings.filter((f) => f.severity === 'high').length,
      medium: sortedFindings.filter((f) => f.severity === 'medium').length,
      low: sortedFindings.filter((f) => f.severity === 'low').length,
    };

    return {
      url: this.url,
      generatedAt: this.startedAt.toISOString(),
      summary,
      findings: sortedFindings,
    };
  }
}

module.exports = AuditReportBuilder;
