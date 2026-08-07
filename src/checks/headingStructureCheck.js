'use strict';

const Check = require('./checkInterface');

class HeadingStructureCheck extends Check {
  run(context) {
    const findings = [];
    const { $ } = context;
    if (!$) return findings;

    const levels = [];
    $('h1, h2, h3, h4, h5, h6').each((_, el) => {
      levels.push(Number(el.tagName.substring(1)));
    });

    let skipped = false;
    for (let i = 1; i < levels.length; i += 1) {
      if (levels[i] - levels[i - 1] > 1) {
        skipped = true;
        break;
      }
    }

    if (skipped) {
      findings.push({
        id: 'seo-heading-structure',
        category: 'seo',
        severity: 'low',
        description: 'The heading structure skips levels (e.g. an <h2> followed directly by an <h4>).',
        fix: 'Use headings in sequential order (h1 → h2 → h3) without skipping levels.',
      });
    }

    return findings;
  }
}

module.exports = HeadingStructureCheck;
