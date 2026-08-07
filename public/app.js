(function () {
  const form = document.getElementById('audit-form');
  const statusEl = document.getElementById('status');
  const reportContainer = document.getElementById('report-container');
  const reportActions = document.getElementById('report-actions');
  const printBtn = document.getElementById('print-btn');
  const downloadBtn = document.getElementById('download-btn');
  const submitBtn = document.getElementById('submit-btn');

  let lastHtmlReport = '';

  function setStatus(message, isError) {
    statusEl.hidden = !message;
    statusEl.textContent = message || '';
    statusEl.className = 'status' + (isError ? ' status-error' : '');
  }

  async function handleCreateTask(event) {
    const button = event.target;
    if (!button.classList || !button.classList.contains('create-task-btn')) return;

    let finding;
    try {
      finding = JSON.parse(button.getAttribute('data-finding'));
    } catch (err) {
      return;
    }

    button.disabled = true;
    button.textContent = 'Creating...';

    try {
      const res = await fetch('/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ finding }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to create task.');
      }

      button.textContent = `Task Created (${data.task.id})`;
    } catch (err) {
      button.disabled = false;
      button.textContent = 'Create Task';
      alert('Could not create task: ' + err.message);
    }
  }

  form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const url = document.getElementById('url-input').value;

    setStatus('Running audit...', false);
    reportActions.hidden = true;
    reportContainer.innerHTML = '';
    submitBtn.disabled = true;

    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Audit failed.');
      }

      lastHtmlReport = data.htmlReport;

      const iframe = document.createElement('iframe');
      iframe.setAttribute('title', 'Audit Report');
      iframe.className = 'report-frame';
      reportContainer.appendChild(iframe);

      iframe.srcdoc = data.htmlReport;

      iframe.addEventListener('load', function () {
        iframe.contentDocument.body.addEventListener('click', handleCreateTask);
      });

      reportActions.hidden = false;
      setStatus('Audit complete.', false);
    } catch (err) {
      setStatus('Error: ' + err.message, true);
    } finally {
      submitBtn.disabled = false;
    }
  });

  printBtn.addEventListener('click', function () {
    const iframe = reportContainer.querySelector('iframe');
    if (iframe) {
      iframe.contentWindow.print();
    }
  });

  downloadBtn.addEventListener('click', function () {
    if (!lastHtmlReport) return;
    const blob = new Blob([lastHtmlReport], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'audit-report.html';
    link.click();
    URL.revokeObjectURL(link.href);
  });
})();
