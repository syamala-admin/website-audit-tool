const { test, expect } = require('@playwright/test');

test('AC10: POST /tasks endpoint accepts a finding and returns a mock task ID', async ({ request }) => {
  const sampleFinding = {
    category: 'https',
    severity: 'high',
    description: 'Site does not use HTTPS',
    fix: 'Enable HTTPS via a valid SSL certificate',
  };

  const response = await request.post('/tasks', { data: { finding: sampleFinding } });
  expect([200, 201]).toContain(response.status());

  const body = await response.json();
  const taskId = body.taskId ?? body.id ?? body.task_id;
  expect(taskId).toBeTruthy();
});
