const { test, expect } = require('@playwright/test');

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

test.describe('Delete audit from Recent audits list', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the Recent audits page before each test
    await page.goto(baseURL);
  });

  test('Each audit item in the Recent audits list displays a Delete button labelled with aria-label="Delete audit" or visible "Delete" text', async ({ page }) => {
    // Wait for the page to load and audits to be rendered
    await page.waitForSelector('[data-testid="audit-item"]', { timeout: 5000 });
    
    // Get the first audit item
    const auditItem = page.locator('[data-testid="audit-item"]').first();
    await expect(auditItem).toBeVisible();
    
    // Check for Delete button with aria-label OR visible "Delete" text
    const deleteButton = auditItem.locator('button[aria-label="Delete audit"], button:has-text("Delete")');
    await expect(deleteButton).toBeVisible();
  });

  test('DELETE /api/audits/:id successfully removes the audit and returns 204 or 200 with {deleted:true}', async ({ request }) => {
    // First, fetch a list of audits to get an ID to delete
    const listResponse = await request.get(`${baseURL}/api/audits`);
    expect(listResponse.ok()).toBeTruthy();
    const audits = await listResponse.json();
    
    if (audits.length === 0) {
      test.skip();
    }
    
    const auditIdToDelete = audits[0].id;
    
    // Now delete the audit
    const deleteResponse = await request.delete(`${baseURL}/api/audits/${auditIdToDelete}`);
    
    // Assert response status is 204 or 200
    expect([200, 204]).toContain(deleteResponse.status());
    
    // If 200, check the response body for {deleted:true}
    if (deleteResponse.status() === 200) {
      const body = await deleteResponse.json();
      expect(body.deleted).toBe(true);
    }
  });

  test('DELETE /api/audits/:id with a non-existent id returns 404', async ({ request }) => {
    const nonExistentId = 'nonexistent-id-99999';
    const deleteResponse = await request.delete(`${baseURL}/api/audits/${nonExistentId}`);
    
    expect(deleteResponse.status()).toBe(404);
  });

  test('Clicking Delete removes the audit from the list without a page reload', async ({ page }) => {
    // Wait for audits to load
    await page.waitForSelector('[data-testid="audit-item"]', { timeout: 5000 });
    
    // Get initial count of audits
    const auditCountBefore = await page.locator('[data-testid="audit-item"]').count();
    expect(auditCountBefore).toBeGreaterThan(0);
    
    // Get the first audit item's text for later verification
    const firstAudit = page.locator('[data-testid="audit-item"]').first();
    const auditTitle = await firstAudit.locator('[data-testid="audit-title"]').textContent();
    
    // Set up listener to detect page reload
    let pageReloaded = false;
    page.on('load', () => {
      pageReloaded = true;
    });
    
    // Click the delete button
    const deleteButton = firstAudit.locator('button[aria-label="Delete audit"], button:has-text("Delete")').first();
    await deleteButton.click();
    
    // Wait a brief moment for DOM update
    await page.waitForTimeout(500);
    
    // Verify the audit was removed from the DOM
    const auditCountAfter = await page.locator('[data-testid="audit-item"]').count();
    expect(auditCountAfter).toBe(auditCountBefore - 1);
    
    // Verify the specific audit is no longer visible
    const deletedAuditStillVisible = await page.locator(`[data-testid="audit-item"]:has-text("${auditTitle}")`).count();
    expect(deletedAuditStillVisible).toBe(0);
    
    // Verify page did not reload
    expect(pageReloaded).toBe(false);
  });

  test('After page reload, the deleted audit does not reappear in the list', async ({ page }) => {
    // Wait for audits to load
    await page.waitForSelector('[data-testid="audit-item"]', { timeout: 5000 });
    
    // Get the first audit's info
    const firstAudit = page.locator('[data-testid="audit-item"]').first();
    const auditTitle = await firstAudit.locator('[data-testid="audit-title"]').textContent();
    const auditId = await firstAudit.getAttribute('data-audit-id');
    
    // Delete the audit
    const deleteButton = firstAudit.locator('button[aria-label="Delete audit"], button:has-text("Delete")').first();
    await deleteButton.click();
    await page.waitForTimeout(500);
    
    // Reload the page
    await page.reload();
    
    // Wait for audits to load again
    await page.waitForTimeout(1000);
    
    // Check that the deleted audit is not in the list
    const deletedAuditPresent = await page.locator(`[data-testid="audit-item"][data-audit-id="${auditId}"]`).count();
    expect(deletedAuditPresent).toBe(0);
  });

  test('After deletion, GET /api/audits excludes the deleted audit', async ({ request, page }) => {
    // First, fetch the current list
    const initialResponse = await request.get(`${baseURL}/api/audits`);
    const initialAudits = await initialResponse.json();
    
    if (initialAudits.length === 0) {
      test.skip();
    }
    
    const auditToDelete = initialAudits[0];
    const auditIdToDelete = auditToDelete.id;
    
    // Delete the audit via API
    const deleteResponse = await request.delete(`${baseURL}/api/audits/${auditIdToDelete}`);
    expect([200, 204]).toContain(deleteResponse.status());
    
    // Fetch the list again
    const afterDeleteResponse = await request.get(`${baseURL}/api/audits`);
    const afterDeleteAudits = await afterDeleteResponse.json();
    
    // Verify the deleted audit is not in the list
    const deletedAuditStillPresent = afterDeleteAudits.some(audit => audit.id === auditIdToDelete);
    expect(deletedAuditStillPresent).toBe(false);
  });

  test('Deleting the last remaining audit displays the empty state "No audits yet."', async ({ page }) => {
    // Wait for audits to load
    await page.waitForSelector('[data-testid="audit-item"]', { timeout: 5000 });
    
    // Keep deleting audits until only one remains
    let auditCount = await page.locator('[data-testid="audit-item"]').count();
    
    while (auditCount > 1) {
      const firstAudit = page.locator('[data-testid="audit-item"]').first();
      const deleteButton = firstAudit.locator('button[aria-label="Delete audit"], button:has-text("Delete")').first();
      await deleteButton.click();
      await page.waitForTimeout(500);
      auditCount = await page.locator('[data-testid="audit-item"]').count();
    }
    
    // Delete the last audit
    const lastAudit = page.locator('[data-testid="audit-item"]').first();
    const lastDeleteButton = lastAudit.locator('button[aria-label="Delete audit"], button:has-text("Delete")').first();
    await lastDeleteButton.click();
    await page.waitForTimeout(500);
    
    // Verify the empty state message is displayed
    const emptyState = page.locator('text="No audits yet."');
    await expect(emptyState).toBeVisible();
    
    // Verify no audit items remain
    const finalAuditCount = await page.locator('[data-testid="audit-item"]').count();
    expect(finalAuditCount).toBe(0);
  });
});
