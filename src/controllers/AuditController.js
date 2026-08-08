const auditService = require('../services/AuditService');
const { isValidUrl } = require('../utils/validators');

class AuditController {
  async createAudit(req, res) {
    const { url } = req.body || {};

    if (!isValidUrl(url)) {
      return res.status(400).json({
        error: true,
        message: 'Please provide a valid URL starting with http:// or https://.',
        url: url || null,
      });
    }

    try {
      const report = await auditService.runAudit(url.trim());
      return res.status(200).json(report);
    } catch (err) {
      const status = err.status || 500;
      return res.status(status).json({
        error: true,
        message: err.message || 'An unexpected error occurred while auditing the URL.',
        url,
      });
    }
  }

  async getAudit(req, res) {
    const report = auditService.getReport(req.params.id);

    if (!report) {
      return res.status(404).json({ error: true, message: 'Report not found.' });
    }

    return res.status(200).json(report);
  }
}

module.exports = new AuditController();
