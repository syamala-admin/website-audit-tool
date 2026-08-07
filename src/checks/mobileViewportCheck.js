'use strict';

const Check = require('./checkInterface');

class MobileViewportCheck extends Check {
  run(context) {
    const findings = [];
    const { $ } = context;
    if (!$) return findings;

    const viewport = $('meta[name="viewport"]').attr('content');

    if (!viewport) {
      findings.push({
        id: 'technical-mobile-viewport',
        category: 'technical',
        severity: 'medium',
        description: 'No mobile viewport meta tag was found.',
        fix: 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to the page head.',
      });
    }

    return findings;
  }
}

module.exports = MobileViewportCheck;
