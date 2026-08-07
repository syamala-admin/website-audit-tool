'use strict';

const Check = require('./checkInterface');

class ImageAltCheck extends Check {
  run(context) {
    const findings = [];
    const { $ } = context;
    if (!$) return findings;

    const images = $('img');
    const missingAlt = images.filter((_, el) => {
      const alt = $(el).attr('alt');
      return alt === undefined || alt.trim() === '';
    });

    if (missingAlt.length > 0) {
      findings.push({
        id: 'technical-image-alt',
        category: 'technical',
        severity: 'medium',
        description: `${missingAlt.length} of ${images.length} image(s) are missing descriptive alt text.`,
        fix: 'Add descriptive alt attributes to all meaningful images for accessibility and SEO.',
      });
    }

    return findings;
  }
}

module.exports = ImageAltCheck;
