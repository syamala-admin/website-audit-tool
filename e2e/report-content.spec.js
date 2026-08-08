const { test, expect } = require('@playwright/test');

test('AC7: each finding includes severity level, plain-language description, and suggested fix', async ({ request }) => {
  const response = await request.post('/audit', { data: { url: 'https://example.com' } });
  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  const findings = body.findings || body.results || (body.report && body.report.findings);

  expect(Array.isArray(findings)).toBeTruthy();
  expect(findings.length).toBeGreaterThan(0);

  for (const finding of findings) {
    const severity = finding.severity ?? finding.level;
    const description = finding.description ?? finding.message ?? finding.issue;
    const fix = finding.fix ?? finding.suggestedFix ?? finding.recommendation ?? finding.suggestion;

    expect(String(severity).toLowerCase()).toMatch(/high|medium|low/);
    expect(typeof description).toBe('string');
    expect(description.length).toBeGreaterThan(0);
    expect(typeof fix).toBe('string');
    expect(fix.length).toBeGreaterThan(0);
  }
});
