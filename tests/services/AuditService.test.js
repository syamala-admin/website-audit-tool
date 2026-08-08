jest.mock('../../src/adapters/HttpClient', () => ({
  fetch: jest.fn(),
}));

const httpClient = require('../../src/adapters/HttpClient');
const auditService = require('../../src/services/AuditService');

describe('AuditService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('throws a clear error when the URL is unreachable', async () => {
    httpClient.fetch.mockResolvedValue({
      ok: false,
      status: null,
      error: 'connection timeout after 10 seconds',
      body: null,
    });

    await expect(auditService.runAudit('https://unreachable.example.com'))
      .rejects.toThrow(/Unable to reach URL/);
  });

  it('returns a report with findings, summary, and html when the page loads', async () => {
    httpClient.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      error: null,
      body: `
        <html>
          <head>
            <title>Test Page</title>
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="description" content="A test page">
            <link rel="canonical" href="https://example.com">
          </head>
          <body>
            <h1>Welcome</h1>
            <img src="a.jpg" alt="An image">
          </body>
        </html>
      `,
    });

    const report = await auditService.runAudit('https://example.com');

    expect(report.url).toBe('https://example.com');
    expect(Array.isArray(report.findings)).toBe(true);
    expect(report.findings.length).toBeGreaterThan(0);
    expect(report.summary).toHaveProperty('total');
    expect(report.html).toContain('Audit Report for https://example.com');
  });
});
