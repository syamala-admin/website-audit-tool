const { createFinding } = require('../utils/finding');

class ImageAltCheck {
  constructor() {
    this.id = 'image-alt-text';
    this.category = 'SEO';
  }

  run(doc) {
    const images = doc.getImages();
    const missing = images.filter((img) => !img.alt || img.alt.trim() === '');
    const passed = images.length === 0 || missing.length === 0;

    return [createFinding({
      id: this.id,
      category: this.category,
      severity: passed ? 'info' : 'medium',
      passed,
      title: 'Image Alt Text',
      description: passed
        ? `All ${images.length} image(s) on the page have alt text.`
        : `${missing.length} of ${images.length} image(s) are missing alt text, which hurts accessibility and image SEO.`,
      suggestedFix: passed
        ? 'No action needed.'
        : 'Add descriptive alt attributes to all images that convey their content or purpose.',
    })];
  }
}

module.exports = ImageAltCheck;
