const { createFinding } = require('../utils/finding');

class TitleTagCheck {
  constructor() {
    this.id = 'title-tag';
    this.category = 'SEO';
  }

  run(doc) {
    const title = doc.getTitle();
    const present = Boolean(title);

    return [createFinding({
      id: this.id,
      category: this.category,
      severity: present ? 'info' : 'high',
      passed: present,
      title: 'Title Tag',
      description: present
        ? `The page has a title tag: "${title}".`
        : 'The page is missing a <title> tag, which is critical for SEO and browser tabs.',
      suggestedFix: present
        ? 'No action needed.'
        : 'Add a unique, descriptive <title> tag (50-60 characters) to the page <head>.',
    })];
  }
}

module.exports = TitleTagCheck;
