const { createFinding } = require('../utils/finding');

class CanonicalCheck {
  constructor() {
    this.id = 'canonical-tag';
    this.category = 'SEO';
  }

  run(doc) {
    const canonical = doc.getCanonical();
    const present = Boolean(canonical);

    return [createFinding({
      id: this.id,
      category: this.category,
      severity: present ? 'info' : 'low',
      passed: present,
      title: 'Canonical Tag',
      description: present
        ? `The page declares a canonical URL: ${canonical}.`
        : 'The page is missing a canonical tag, which can lead to duplicate content issues.',
      suggestedFix: present
        ? 'No action needed.'
        : 'Add a <link rel="canonical" href="..."> tag pointing to the preferred version of this page.',
    })];
  }
}

module.exports = CanonicalCheck;
