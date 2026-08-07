'use strict';

const AuditService = require('../services/auditService');

const auditService = new AuditService();

async function createAudit(req, res) {
  const { url } = req.body || {};

  if (!url || typeof url !== 'string' || !url.trim()) {
    return res.status(400).json({ error: 'A "url" field is required.' });
  }

  try {
    const { report, htmlReport } = await auditService.runAudit(url);
    return res.status(200).json({ report, htmlReport });
  } catch (err) {
    // No silent failures: surface the error to the caller.
    return res.status(502).json({ error: err.message || 'Failed to audit the requested URL.' });
  }
}

module.exports = { createAudit };
