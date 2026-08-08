const { createFinding } = require('../utils/finding');

class HttpsCheck {
  constructor() {
    this.id = 'https';
    this.category = 'Technical';
  }

  run(doc, context) {
    const isHttps = context.url.startsWith('https://');

    return [createFinding({
      id: this.id,
      category: this.category,
      severity: isHttps ? 'info' : 'high',
      passed: isHttps,
      title: 'HTTPS Enabled',
      description: isHttps
        ? 'The site is served over HTTPS, which is secure.'
        : 'The site is not served over HTTPS. Visitors may see security warnings and search engines may rank the site lower.',
      suggestedFix: isHttps
        ? 'No action needed.'
        : 'Install an SSL/TLS certificate and redirect all HTTP traffic to HTTPS.',
    })];
  }
}

module.exports = HttpsCheck;
