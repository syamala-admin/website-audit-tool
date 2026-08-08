const HttpsCheck = require('../../src/checks/HttpsCheck');

describe('HttpsCheck', () => {
  const check = new HttpsCheck();

  it('passes when the URL uses https', () => {
    const [finding] = check.run(null, { url: 'https://example.com' });
    expect(finding.passed).toBe(true);
    expect(finding.severity).toBe('info');
  });

  it('fails when the URL uses http', () => {
    const [finding] = check.run(null, { url: 'http://example.com' });
    expect(finding.passed).toBe(false);
    expect(finding.severity).toBe('high');
    expect(finding.suggestedFix).toMatch(/SSL/i);
  });
});
