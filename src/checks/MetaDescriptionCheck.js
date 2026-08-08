const { createFinding } = require('../utils/finding');

class MetaDescriptionCheck {
  constructor() {
    this.id = 'meta-description';
    this.category = 'SEO';
  }

  run(doc) {
    const description = doc.getMetaTag('description');
    const present = Boolean(description && description.trim());

    return [createFinding({
      id: this.id,
      category: this.category,
      severity: present ? 'info' : 'medium',
      passed: present,
      title: 'Meta Description',
      description: present
        ? 'The page has a meta description.'
        : 'The page is missing a meta description, which search engines use for search result snippets.',
      suggestedFix: present
        ? 'No action needed.'
        : 'Add a unique meta description (roughly 150-160 characters) summarizing the page content.',
    })];
  }
}

module.exports = MetaDescriptionCheck;
