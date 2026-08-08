const { createFinding } = require('../utils/finding');

class MobileViewportCheck {
  constructor() {
    this.id = 'mobile-viewport';
    this.category = 'Technical';
  }

  run(doc) {
    const viewport = doc.getMetaViewport();
    const present = Boolean(viewport);

    return [createFinding({
      id: this.id,
      category: this.category,
      severity: present ? 'info' : 'medium',
      passed: present,
      title: 'Mobile Viewport Meta Tag',
      description: present
        ? 'A mobile viewport meta tag is present, helping the page render correctly on mobile devices.'
        : 'No mobile viewport meta tag was found. The page may not render correctly on mobile devices.',
      suggestedFix: present
        ? 'No action needed.'
        : 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> to the page <head>.',
    })];
  }
}

module.exports = MobileViewportCheck;
