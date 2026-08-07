'use strict';

const Check = require('./checkInterface');

class H1Check extends Check {
  run(context) {
    const findings = [];
    const { $ } = context;
    if (!$) return findings;

    const h1Count = $('h1').length;

    if (h1Count === 0) {
      findings.push({
        id: 'seo-h1-missing',
        category: 'seo',
        severity: 'high',
        description: 'The page has no <h1> heading.',
        fix: 'Add exactly one <h1> that describes the main topic of the page.',
      });
    } else if (h1Count > 1) {
      findings.push({
        id: 'seo-h1-multiple',
        category: 'seo',
        severity: 'medium',
        description: `The page has ${h1Count} <h1> tags; there should be exactly one.`,
        fix: 'Keep a single <h1> per page and use <h2>/<h3> for subsections.',
      });
    }

    return findings;
  }
}

module.exports = H1Check;
