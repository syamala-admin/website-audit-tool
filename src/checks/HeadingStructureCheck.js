const { createFinding } = require('../utils/finding');

class HeadingStructureCheck {
  constructor() {
    this.id = 'heading-structure';
    this.category = 'SEO';
  }

  run(doc) {
    const headings = doc.getAllHeadings();
    let previousLevel = 0;
    let valid = true;
    let issue = null;

    for (const heading of headings) {
      const level = Number(heading.tag.replace('h', ''));
      if (previousLevel !== 0 && level - previousLevel > 1) {
        valid = false;
        issue = `Heading level jumps from H${previousLevel} to H${level} ("${heading.text}"), skipping a level.`;
        break;
      }
      previousLevel = level;
    }

    return [createFinding({
      id: this.id,
      category: this.category,
      severity: valid ? 'info' : 'low',
      passed: valid,
      title: 'Heading Structure',
      description: valid
        ? 'The heading structure follows a logical order without skipped levels.'
        : issue,
      suggestedFix: valid
        ? 'No action needed.'
        : 'Reorganize headings so levels descend sequentially (H1 > H2 > H3) without skipping levels.',
    })];
  }
}

module.exports = HeadingStructureCheck;
