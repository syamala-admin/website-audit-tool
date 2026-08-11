import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

function getUrlInput(page) {
  return page.getByLabel(/URL/i).or(page.locator('input[placeholder*="url" i]')).first();
}

function getAuditButton(page) {
  return page.getByRole('button', { name: /audit|scan/i }).first();
}

test.describe('Audit persistence and display', () => {
  test('When a user submits a URL and the audit completes, the audit appears in the Recent audits list', async ({ page }) => {
    await page.goto(baseURL);

    const urlInput = getUrlInput(page);
    const auditButton = getAuditButton(page);

    await urlInput.fill('https://example.com');
    await auditButton.click();

    await page.waitForSelector('[data-testid="audit-item"]', { timeout: 10000 });

    const auditItem = page.locator('[data-testid="audit-item"]').first();
    await expect(auditItem).toContainText('example.com');
  });

  test('When an audit completes, the scanned URL, timestamp, and issue count are persisted to a database record.', async ({ page, request }) => {
    await page.goto(baseURL);

    const urlInput = getUrlInput(page);
    const auditButton = getAuditButton(page);

    await urlInput.fill('https://persisted-test.com');
    await auditButton.click();

    await page.waitForSelector('[data-testid="audit-item"]', { timeout: 10000 });

    const listResponse = await request.get(`${baseURL}/api/audits`);
    expect(listResponse.ok()).toBeTruthy();
    const audits = await listResponse.json();

    const persisted = audits.find((a) => a.url && a.url.includes('persisted-test.com'));
    expect(persisted).toBeTruthy();
    expect(persisted.url).toContain('persisted-test.com');
    expect(persisted.timestamp || persisted.createdAt).toBeTruthy();

    const issueCountValue = persisted.issueCount !== undefined ? persisted.issueCount : persisted.issues;
    expect(typeof issueCountValue).toBe('number');
  });

  test('When a new audit finishes, it appears at the top of the Recent audits list without requiring a page reload.', async ({ page }) => {
    await page.goto(baseURL);
    await page.waitForLoadState('networkidle');

    // CI runs against an empty DB, so capture whatever the current count actually is
    // rather than assuming a pre-existing list.
    const initialCount = await page.locator('[data-testid="audit-item"]').count();

    const urlInput = getUrlInput(page);
    const auditButton = getAuditButton(page);

    await urlInput.fill('https://top-of-list-test.com');
    await auditButton.click();

    await expect(page.locator('[data-testid="audit-item"]')).toHaveCount(initialCount + 1, { timeout: 10000 });

    const firstAuditItem = page.locator('[data-testid="audit-item"]').first();
    await expect(firstAuditItem).toContainText('top-of-list-test.com');
  });
});
