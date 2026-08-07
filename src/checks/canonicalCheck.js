'use strict';

const Check = require('./checkInterface');

class CanonicalCheck extends Check {
  run(context) {
    const findings = [];
    const { $ } = context;
    if (!$) return findings;

    const canonical = $('link[rel="canonical"]').attr('href');

    if (!canonical) {
      findings.push({
        id: 'seo-canonical-missing',
        category: 'seo',
        severity: 'medium',
        description: 'No canonical link tag was found.',
        fix: 'Add a <link rel="canonical" href="..."> tag pointing to the preferred URL for this page.',
      });
    }

    return findings;
  }
}

module.exports = CanonicalCheck;
