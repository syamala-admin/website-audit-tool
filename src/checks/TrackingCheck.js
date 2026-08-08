const { createFinding } = require('../utils/finding');

class TrackingCheck {
  constructor() {
    this.id = 'tracking';
    this.category = 'Tracking';
  }

  run(doc) {
    const rawHtml = doc.getRawHtml();
    const scripts = doc.getScripts().join(' ');
    const haystack = `${rawHtml} ${scripts}`;

    const detectors = [
      { name: 'Google Analytics', pattern: /(gtag\(|analytics\.js|www\.google-analytics\.com|G-[A-Z0-9]{6,})/i },
      { name: 'Google Tag Manager', pattern: /(googletagmanager\.com|GTM-[A-Z0-9]+)/i },
      { name: 'Facebook Pixel', pattern: /(connect\.facebook\.net|fbq\()/i },
    ];

    const detected = detectors.filter((d) => d.pattern.test(haystack)).map((d) => d.name);

    return [createFinding({
      id: this.id,
      category: this.category,
      severity: detected.length > 0 ? 'info' : 'medium',
      passed: detected.length > 0,
      title: 'Tracking & Analytics',
      description: detected.length > 0
        ? `Detected tracking: ${detected.join(', ')}.`
        : 'No Google Analytics, Google Tag Manager, or Facebook Pixel tracking was detected.',
      suggestedFix: detected.length > 0
        ? 'No action needed.'
        : 'Install Google Analytics, Google Tag Manager, or Facebook Pixel to measure site traffic and conversions.',
    })];
  }
}

module.exports = TrackingCheck;
