'use strict';

const Check = require('./checkInterface');

class HttpsCheck extends Check {
  run(context) {
    const findings = [];
    const { url, finalUrl } = context;
    const effectiveUrl = finalUrl || url;
    const isHttps = effectiveUrl.toLowerCase().startsWith('https://');

    if (!isHttps) {
      findings.push({
        id: 'technical-https',
        category: 'technical',
        severity: 'high',
        description: 'The site is not served over HTTPS.',
        fix: 'Install a valid SSL/TLS certificate and redirect all HTTP traffic to HTTPS.',
      });
    }

    return findings;
  }
}

module.exports = HttpsCheck;
