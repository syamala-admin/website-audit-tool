const form = document.getElementById('audit-form');
const urlInput = document.getElementById('url-input');
const errorBanner = document.getElementById('error-banner');
const loading = document.getElementById('loading');
const reportContainer = document.getElementById('report-container');
const saveTaskContainer = document.getElementById('save-task-container');
const saveTaskBtn = document.getElementById('save-task-btn');
const taskResult = document.getElementById('task-result');

let currentReport = null;

function isValidUrl(value) {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

function showError(message) {
  errorBanner.textContent = message;
  errorBanner.hidden = false;
}

function clearError() {
  errorBanner.hidden = true;
  errorBanner.textContent = '';
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  clearError();
  taskResult.textContent = '';
  saveTaskContainer.hidden = true;
  reportContainer.innerHTML = '';

  const url = urlInput.value.trim();

  if (!isValidUrl(url)) {
    showError('Please enter a valid URL starting with http:// or https://.');
    return;
  }

  loading.hidden = false;

  try {
    const response = await fetch('/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      showError(`${data.message || 'Unable to complete the audit.'} (URL: ${url})`);
      return;
    }

    currentReport = data;
    reportContainer.innerHTML = data.html;
    saveTaskContainer.hidden = false;
  } catch (err) {
    showError(`Unable to reach the audit service: ${err.message}`);
  } finally {
    loading.hidden = true;
  }
});

saveTaskBtn.addEventListener('click', async () => {
  if (!currentReport) return;

  taskResult.textContent = 'Saving...';

  try {
    const response = await fetch('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reportId: currentReport.id,
        url: currentReport.url,
        findings: currentReport.findings.filter((f) => !f.passed),
      }),
    });

    const data = await response.json();

    if (!response.ok || data.error) {
      taskResult.textContent = `Error saving task: ${data.message || 'Unknown error'}`;
      return;
    }

    taskResult.textContent = `Task saved successfully. Task ID: ${data.taskId}`;
  } catch (err) {
    taskResult.textContent = `Error saving task: ${err.message}`;
  }
});
