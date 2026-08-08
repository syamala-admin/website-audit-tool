const { createFinding } = require('../utils/finding');

class H1Check {
  constructor() {
    this.id = 'h1-tag';
    this.category = 'SEO';
  }

  run(doc) {
    const h1s = doc.getHeadings('h1');
    const passed = h1s.length === 1;

    let description;
    if (h1s.length === 0) {
      description = 'The page has no <h1> tag. Every page should have exactly one main heading.';
    } else if (h1s.length > 1) {
      description = `The page has ${h1s.length} <h1> tags. Search engines expect exactly one main heading per page.`;
    } else {
      description = 'The page has exactly one <h1> tag, as recommended.';
    }

    return [createFinding({
      id: this.id,
      category: this.category,
      severity: passed ? 'info' : 'medium',
      passed,
      title: 'Single H1 Tag',
      description,
      suggestedFix: passed
        ? 'No action needed.'
        : 'Ensure the page has exactly one <h1> tag that describes the main topic of the page.',
    })];
  }
}

module.exports = H1Check;
