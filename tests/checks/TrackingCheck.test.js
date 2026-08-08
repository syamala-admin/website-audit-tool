const TrackingCheck = require('../../src/checks/TrackingCheck');
const htmlParser = require('../../src/adapters/HtmlParser');

describe('TrackingCheck', () => {
  const check = new TrackingCheck();

  it('detects Google Analytics', () => {
    const doc = htmlParser.parse('<script>gtag("config", "G-ABC123");</script>');
    const [finding] = check.run(doc);
    expect(finding.passed).toBe(true);
    expect(finding.description).toMatch(/Google Analytics/);
  });

  it('flags when no tracking is found', () => {
    const doc = htmlParser.parse('<p>Nothing here</p>');
    const [finding] = check.run(doc);
    expect(finding.passed).toBe(false);
    expect(finding.severity).toBe('medium');
  });
});
