import { test, expect } from '@playwright/test';

const baseURL = process.env.BASE_URL || 'http://localhost:3000';

test('Clicking Delete button removes an audit from the list immediately without page reload', async ({ page, request }) => {
  await page.goto(baseURL);

  // Create one audit
  const urlInput = await page.getByLabel(/URL/i).or(page.locator('input[placeholder*="url" i]')).first();
  const auditButton = await page.getByRole('button', { name: /audit|scan/i }).first();
  await urlInput.fill('https://test.com');
  await auditButton.click();
  await page.waitForTimeout(1000);

  // Get the delete button and click it
  const deleteButton = await page.getByRole('button', { name: /delete/i }).first();
  await expect(deleteButton).toHaveAttribute('aria-label', 'Delete audit');
  
  // Set up dialog handler to confirm deletion
  page.once('dialog', dialog => {
    dialog.accept();
  });
  
  await deleteButton.click();
  await page.waitForTimeout(500);

  // Verify the audit is removed from the DOM
  const listItems = await page.locator('li');
  expect(await listItems.count()).toBe(0);

  // Verify empty state is shown
  const noAuditsMessage = await page.locator('#no-audits-message');
  await expect(noAuditsMessage).not.toHaveAttribute('hidden', '');

  await page.close();
});

test('After deleting the last audit, empty state message "No audits yet." is displayed', async ({ page, request }) => {
  await page.goto(baseURL);

  // Create one audit
  const urlInput = await page.getByLabel(/URL/i).or(page.locator('input[placeholder*="url" i]')).first();
  const auditButton = await page.getByRole('button', { name: /audit|scan/i }).first();
  await urlInput.fill('https://lastaudit.com');
  await auditButton.click();
  await page.waitForTimeout(1000);

  // Delete the audit
  const deleteButton = await page.getByRole('button', { name: /delete/i }).first();
  
  page.once('dialog', dialog => {
    dialog.accept();
  });
  
  await deleteButton.click();
  await page.waitForTimeout(500);

  // Verify empty state message is displayed
  const noAuditsMessage = await page.locator('#no-audits-message');
  await expect(noAuditsMessage).toContainText('No audits yet.');

  await page.close();
});

test('When an audit completes, the scanned URL, timestamp, and issue count are persisted to a database record.', async ({ request }) => {
  // First, run an audit via the UI to trigger the save  
  await page.goto(baseURL);

  // Fill in the URL input and run the audit
  const urlInput = await page.getByLabel(/URL/i).or(page.locator('input[placeholder*="url" i]')).first();
  await urlInput.fill('https://example.com');
  const auditButton = await page.getByRole('button', { name: /audit|scan/i }).first();
  await auditButton.click();

  // Wait for the audit to complete
  await page.waitForTimeout(3000); // Allow time for backend processing

  // Verify the audit was persisted by checking the database via API
  const auditsResponse = await request.get(`${baseURL}/api/audits`);
  expect(auditsResponse.ok()).toBe(true);
  const audits = await auditsResponse.json();

  // Check that the most recent audit has the scanned URL
  expect(audits.length).toBeGreaterThan(0);
  const latestAudit = audits[0];
  expect(latestAudit.url).toBe('https://example.com');
  expect(latestAudit).toHaveProperty('issueCount');
  expect(typeof latestAudit.issueCount).toBe('number');
  expect(latestAudit).toHaveProperty('createdAt');

  await page.close();
});

test('GET /api/audits returns the 10 most recent audits (newest first) in JSON format with fields: url, issueCount, createdAt.', async ({ request }) => {
  const response = await request.get(`${baseURL}/api/audits`);
  expect(response.ok()).toBe(true);

  const audits = await response.json();
  expect(Array.isArray(audits)).toBe(true);
  expect(audits.length).toBeLessThanOrEqual(10);

  // Verify each audit has the required fields
  for (const audit of audits) {
    expect(audit).toHaveProperty('url');
    expect(audit).toHaveProperty('issueCount');
    expect(audit).toHaveProperty('createdAt');
    expect(typeof audit.url).toBe('string');
    expect(typeof audit.issueCount).toBe('number');
    expect(typeof audit.createdAt).toBe('string');
  }

  // Verify newest first: compare timestamps of consecutive audits
  for (let i = 0; i < audits.length - 1; i++) {
    const current = new Date(audits[i].createdAt).getTime();
    const next = new Date(audits[i + 1].createdAt).getTime();
    expect(current).toBeGreaterThanOrEqual(next);
  }
});

test('The page displays a \'Recent audits\' section listing each audit\'s URL and issue count.', async ({ page }) => {
  await page.goto(baseURL);

  // Look for the Recent audits section
  const recentAuditsSection = await page.getByRole('region', { name: /recent audits/i })
    .or(page.getByText(/recent audits/i).first());
  await expect(recentAuditsSection).toBeVisible();

  // Fetch audits via API to know what we're looking for
  const auditsResponse = await page.request.get(`${baseURL}/api/audits`);
  const audits = await auditsResponse.json();

  if (audits.length > 0) {
    // Verify at least the first audit's URL and issue count are displayed
    const firstAudit = audits[0];
    await expect(page.getByText(firstAudit.url)).toBeVisible();
    await expect(page.getByText(new RegExp(firstAudit.issueCount.toString()))).toBeVisible();
  }
});

test('When a new audit finishes, it appears at the top of the Recent audits list without requiring a page reload.', async ({ page }) => {
  await page.goto(baseURL);

  // Get the current first audit (if any)
  const auditsResponse = await page.request.get(`${baseURL}/api/audits`);
  const auditsBefore = await auditsResponse.json();
  const firstAuditBefore = auditsBefore.length > 0 ? auditsBefore[0].url : null;

  // Run a new audit with a unique URL
  const uniqueUrl = `https://test-${Date.now()}.example.com`;
  const urlInput = await page.getByLabel(/URL/i).or(page.locator('input[placeholder*="url" i]')).first();
  await urlInput.fill(uniqueUrl);
  const auditButton = await page.getByRole('button', { name: /audit|scan/i }).first();
  await auditButton.click();

  // Wait for the audit to appear in the Recent audits list (without page reload)
  await page.waitForTimeout(3000);
  await expect(page.getByText(uniqueUrl)).toBeVisible({ timeout: 10000 });

  // Verify it's at the top by checking the Recent audits section
  const recentSection = await page.getByRole('region', { name: /recent audits/i })
    .or(page.getByText(/recent audits/i).first());
  const recentText = await recentSection.textContent();
  const urlIndex = recentText.indexOf(uniqueUrl);
  const firstAuditIndex = firstAuditBefore ? recentText.indexOf(firstAuditBefore) : -1;

  // New audit URL should appear before the old first audit (or be the only one)
  if (firstAuditIndex !== -1) {
    expect(urlIndex).toBeLessThan(firstAuditIndex);
  } else {
    expect(urlIndex).toBeGreaterThanOrEqual(0);
  }
});

test('When no audits have been saved, the Recent audits section displays the text \'No audits yet.\'', async ({ page, request }) => {
  // This test assumes we can get a clean state. If the app doesn't support it,
  // we verify the display behavior when the API returns an empty list.
  // First, check current state
  const auditsResponse = await request.get(`${baseURL}/api/audits`);
  const audits = await auditsResponse.json();

  if (audits.length === 0) {
    // Navigate to page and verify "No audits yet" message is shown
    await page.goto(baseURL);
    await expect(page.getByText(/No audits yet/i)).toBeVisible({ timeout: 5000 });
  } else {
    // Skip this test if there are audits in the database
    test.skip();
  }
});
