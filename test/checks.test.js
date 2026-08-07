'use strict';

const cheerio = require('cheerio');

const HttpsCheck = require('../src/checks/httpsCheck');
const ReachabilityCheck = require('../src/checks/reachabilityCheck');
const MobileViewportCheck = require('../src/checks/mobileViewportCheck');
const ImageAltCheck = require('../src/checks/imageAltCheck');
const TitleCheck = require('../src/checks/titleCheck');
const MetaDescriptionCheck = require('../src/checks/metaDescriptionCheck');
const H1Check = require('../src/checks/h1Check');
const CanonicalCheck = require('../src/checks/canonicalCheck');
const FormCheck = require('../src/checks/formCheck');
const TrackingCheck = require('../src/checks/trackingCheck');

function buildContext(html, overrides = {}) {
  const $ = cheerio.load(html);
  return {
    url: 'https://example.com',
    finalUrl: 'https://example.com',
    fetchResult: { ok: true, status: 200, error: null },
    html,
    $,
    ...overrides,
  };
}

describe('HttpsCheck', () => {
  it('flags non-https URLs', () => {
    const findings = new HttpsCheck().run({ url: 'http://example.com', finalUrl: 'http://example.com' });
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('high');
  });

  it('passes for https URLs', () => {
    const findings = new HttpsCheck().run({ url: 'https://example.com', finalUrl: 'https://example.com' });
    expect(findings).toHaveLength(0);
  });
});

describe('ReachabilityCheck', () => {
  it('flags timeouts', () => {
    const findings = new ReachabilityCheck().run({
      fetchResult: { ok: false, error: { timedOut: true, message: 'timed out' } },
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('high');
  });

  it('passes for a 200 response', () => {
    const findings = new ReachabilityCheck().run({ fetchResult: { ok: true, status: 200 } });
    expect(findings).toHaveLength(0);
  });
});

describe('MobileViewportCheck', () => {
  it('flags missing viewport tag', () => {
    const context = buildContext('<html><head></head><body></body></html>');
    expect(new MobileViewportCheck().run(context)).toHaveLength(1);
  });

  it('passes when viewport tag present', () => {
    const context = buildContext(
      '<html><head><meta name="viewport" content="width=device-width, initial-scale=1"></head></html>'
    );
    expect(new MobileViewportCheck().run(context)).toHaveLength(0);
  });
});

describe('ImageAltCheck', () => {
  it('flags images missing alt text', () => {
    const context = buildContext('<html><body><img src="a.png"><img src="b.png" alt="ok"></body></html>');
    const findings = new ImageAltCheck().run(context);
    expect(findings).toHaveLength(1);
    expect(findings[0].description).toContain('1 of 2');
  });
});

describe('TitleCheck', () => {
  it('flags missing title', () => {
    const context = buildContext('<html><head></head></html>');
    expect(new TitleCheck().run(context)[0].id).toBe('seo-title-missing');
  });

  it('flags overly short title', () => {
    const context = buildContext('<html><head><title>Hi</title></head></html>');
    expect(new TitleCheck().run(context)[0].id).toBe('seo-title-length');
  });

  it('passes for reasonable length title', () => {
    const context = buildContext('<html><head><title>A Great Landscaping Company in Denver</title></head></html>');
    expect(new TitleCheck().run(context)).toHaveLength(0);
  });
});

describe('MetaDescriptionCheck', () => {
  it('flags missing meta description', () => {
    const context = buildContext('<html><head></head></html>');
    expect(new MetaDescriptionCheck().run(context)[0].id).toBe('seo-meta-description-missing');
  });
});

describe('H1Check', () => {
  it('flags zero h1 tags', () => {
    const context = buildContext('<html><body></body></html>');
    expect(new H1Check().run(context)[0].id).toBe('seo-h1-missing');
  });

  it('flags multiple h1 tags', () => {
    const context = buildContext('<html><body><h1>One</h1><h1>Two</h1></body></html>');
    expect(new H1Check().run(context)[0].id).toBe('seo-h1-multiple');
  });

  it('passes for exactly one h1', () => {
    const context = buildContext('<html><body><h1>One</h1></body></html>');
    expect(new H1Check().run(context)).toHaveLength(0);
  });
});

describe('CanonicalCheck', () => {
  it('flags missing canonical tag', () => {
    const context = buildContext('<html><head></head></html>');
    expect(new CanonicalCheck().run(context)).toHaveLength(1);
  });

  it('passes when canonical present', () => {
    const context = buildContext('<html><head><link rel="canonical" href="https://example.com"></head></html>');
    expect(new CanonicalCheck().run(context)).toHaveLength(0);
  });
});

describe('FormCheck', () => {
  it('flags missing forms', () => {
    const context = buildContext('<html><body></body></html>');
    expect(new FormCheck().run(context)[0].id).toBe('form-missing');
  });

  it('flags forms without action or required fields', () => {
    const context = buildContext('<html><body><form><input name="email"></form></body></html>');
    const findings = new FormCheck().run(context);
    const ids = findings.map((f) => f.id);
    expect(ids).toContain('form-missing-action');
    expect(ids).toContain('form-missing-required-fields');
  });

  it('passes for a well-formed form', () => {
    const context = buildContext(
      '<html><body><form action="/submit"><input name="email" required></form></body></html>'
    );
    expect(new FormCheck().run(context)).toHaveLength(0);
  });
});

describe('TrackingCheck', () => {
  it('flags when no tracking snippets found', () => {
    const context = buildContext('<html><head></head></html>');
    expect(new TrackingCheck().run(context)).toHaveLength(1);
  });

  it('passes when Google Analytics detected', () => {
    const html = '<html><head><script>gtag("config", "UA-XXXX")</script></head></html>';
    const context = buildContext(html);
    expect(new TrackingCheck().run(context)).toHaveLength(0);
  });
});
