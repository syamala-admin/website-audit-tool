const { test, expect } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

async function createAudit(request, url = 'https://example.com') {
  const response = await request.post(`${baseURL}/api/audits`, {
    data: { url },
  });
  expect(response.ok()).toBeTruthy();
  return response.json();
}

async function deleteAllAudits(request) {
  const listResponse = await request.get(`${baseURL}/api/audits`);
  if (!listResponse.ok()) return;
  const audits = await listResponse.json();
  for (const audit of audits) {
    await request.delete(`${baseURL}/api/audits/${audit.id}`);
  }
}

test.describe('Delete audit from Recent audits list', () => {
  test('Each audit item in the Recent audits list displays a Delete button labelled with aria-label="Delete audit" or visible "Delete" text', async ({ page, request }) => {
    // CI runs against an empty DB, so create an audit via the API first.
    await createAudit(request, 'https://delete-button-test.com');

    await page.goto(baseURL);

    await page.waitForSelector('[data-testid="audit-item"]', { timeout: 10000 });

    const auditItem = page.locator('[data-testid="audit-item"]').first();
    await expect(auditItem).toBeVisible();

    const deleteButton = auditItem.locator('button[aria-label="Delete audit"], button:has-text("Delete")');
    await expect(deleteButton).toBeVisible();
  });

  test('DELETE /api/audits/:id successfully removes the audit and returns 204 or 200 with {deleted:true}', async ({ request }) => {
    const audit = await createAudit(request, 'https://delete-api-test.com');

    const deleteResponse = await request.delete(`${baseURL}/api/audits/${audit.id}`);

    expect([200, 204]).toContain(deleteResponse.status());

    if (deleteResponse.status() === 200) {
      const body = await deleteResponse.json();
      expect(body.deleted).toBe(true);
    }
  });

  test('DELETE /api/audits/:id with a non-existent id returns 404', async ({ request }) => {
    const deleteResponse = await request.delete(`${baseURL}/api/audits/non-existent-id-12345`);

    expect(deleteResponse.status()).toBe(404);
  });

  test('Clicking Delete removes the audit from the list without a page reload', async ({ page, request }) => {
    await createAudit(request, 'https://no-reload-test.com');

    await page.goto(baseURL);

    await page.waitForSelector('[data-testid="audit-item"]', { timeout: 10000 });

    const initialCount = await page.locator('[data-testid="audit-item"]').count();
    expect(initialCount).toBeGreaterThan(0);

    const auditItem = page.locator('[data-testid="audit-item"]').first();
    const deleteButton = auditItem.locator('button[aria-label="Delete audit"], button:has-text("Delete")');
    await deleteButton.click();

    await expect(page.locator('[data-testid="audit-item"]')).toHaveCount(initialCount - 1);
  });

  test('After page reload, the deleted audit does not reappear in the list', async ({ page, request }) => {
    const audit = await createAudit(request, 'https://reload-test.com');

    await page.goto(baseURL);

    await page.waitForSelector('[data-testid="audit-item"]', { timeout: 10000 });

    const targetItem = page.locator('[data-testid="audit-item"]').filter({ hasText: audit.url || 'reload-test.com' }).first();
    await expect(targetItem).toBeVisible();

    const deleteButton = targetItem.locator('button[aria-label="Delete audit"], button:has-text("Delete")');
    await deleteButton.click();

    await expect(page.locator('[data-testid="audit-item"]').filter({ hasText: 'reload-test.com' })).toHaveCount(0);

    await page.reload();

    await expect(page.locator('[data-testid="audit-item"]').filter({ hasText: 'reload-test.com' })).toHaveCount(0);
  });

  test('Deleting the last remaining audit displays the empty state "No audits yet."', async ({ page, request }) => {
    // Start from a clean slate so exactly one audit exists.
    await deleteAllAudits(request);
    await createAudit(request, 'https://last-audit-test.com');

    await page.goto(baseURL);

    await page.waitForSelector('[data-testid="audit-item"]', { timeout: 10000 });
    await expect(page.locator('[data-testid="audit-item"]')).toHaveCount(1);

    const deleteButton = page
      .locator('[data-testid="audit-item"]')
      .first()
      .locator('button[aria-label="Delete audit"], button:has-text("Delete")');
    await deleteButton.click();

    await expect(page.locator('[data-testid="audit-item"]')).toHaveCount(0);
    await expect(page.getByText('No audits yet.')).toBeVisible();
  });
});
