'use strict';

const Check = require('./checkInterface');

const TRACKING_SIGNATURES = [
  { name: 'Google Analytics', pattern: /(gtag\(|www\.google-analytics\.com|analytics\.js|ga\('create')/i },
  { name: 'Google Tag Manager', pattern: /googletagmanager\.com\/gtm\.js/i },
  { name: 'Facebook Pixel', pattern: /connect\.facebook\.net\/.+\/fbevents\.js|fbq\(/i },
  { name: 'Hotjar', pattern: /static\.hotjar\.com/i },
  { name: 'HubSpot', pattern: /js\.hs-scripts\.com/i },
];

class TrackingCheck extends Check {
  run(context) {
    const findings = [];
    const { html } = context;
    if (!html) return findings;

    const detected = TRACKING_SIGNATURES.filter((sig) => sig.pattern.test(html)).map((sig) => sig.name);

    if (detected.length === 0) {
      findings.push({
        id: 'tracking-none-detected',
        category: 'tracking',
        severity: 'medium',
        description: 'No analytics or tracking snippets (Google Analytics, GTM, Facebook Pixel, etc.) were detected.',
        fix: 'Install an analytics/tracking tool (e.g. Google Analytics or GTM) so site performance and conversions can be measured.',
      });
    }

    return findings;
  }
}

module.exports = TrackingCheck;
