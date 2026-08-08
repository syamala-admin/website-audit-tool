const { v4: uuidv4 } = require('uuid');
const httpClient = require('../adapters/HttpClient');
const htmlParser = require('../adapters/HtmlParser');
const CheckFactory = require('../checks/CheckFactory');
const reportRepository = require('../repository/ReportRepository');
const reportFormatter = require('../utils/reportFormatter');

const TIMEOUT_MS = 10000;

class AuditService {
  /**
   * Fetches the given URL, runs the full check suite, and returns a
   * structured report available in both JSON and HTML formats.
   * @param {string} url
   * @returns {Promise<object>} report
   */
  async runAudit(url) {
    const response = await httpClient.fetch(url, TIMEOUT_MS);

    if (!response.ok) {
      const error = new Error(
        response.error
          ? `Unable to reach URL: ${response.error}`
          : `URL returned HTTP ${response.status}`,
      );
      error.status = 400;
      error.url = url;
      throw error;
    }

    const doc = htmlParser.parse(response.body);
    const context = { url, response };
    const checks = CheckFactory.createChecks();

    const findings = checks.flatMap((check) => {
      try {
        return check.run(doc, context) || [];
      } catch (err) {
        return [{
          id: check.id,
          category: check.category,
          severity: 'medium',
          passed: false,
          title: `${check.id} check failed`,
          description: `This check could not complete due to an internal error: ${err.message}`,
          suggestedFix: 'Retry the audit. If the issue persists, contact support.',
        }];
      }
    });

    const report = {
      id: uuidv4(),
      url,
      timestamp: new Date().toISOString(),
      findings,
      summary: this._buildSummary(findings),
    };

    report.html = reportFormatter.toHtml(report);

    reportRepository.save(report);

    return report;
  }

  _buildSummary(findings) {
    return {
      total: findings.length,
      failed: findings.filter((f) => !f.passed).length,
      high: findings.filter((f) => !f.passed && f.severity === 'high').length,
      medium: findings.filter((f) => !f.passed && f.severity === 'medium').length,
      low: findings.filter((f) => !f.passed && f.severity === 'low').length,
    };
  }

  getReport(id) {
    return reportRepository.findById(id);
  }
}

module.exports = new AuditService();
