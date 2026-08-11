const auditForm = document.getElementById('audit-form');
const urlInput = document.getElementById('url-input');
const auditStatus = document.getElementById('audit-status');
const recentAuditsList = document.getElementById('recent-audits-list');
const noAuditsMessage = document.getElementById('no-audits-message');

function renderAudits(audits) {
  recentAuditsList.innerHTML = '';

  if (!audits || audits.length === 0) {
    noAuditsMessage.hidden = false;
    return;
  }

  noAuditsMessage.hidden = true;

  audits.forEach((audit) => {
    const item = document.createElement('li');
    item.textContent = `${audit.url} \u2014 ${audit.issueCount} issue${audit.issueCount === 1 ? '' : 's'}`;
    recentAuditsList.appendChild(item);
  });
}

async function loadRecentAudits() {
  try {
    const response = await fetch('/api/audits');
    if (!response.ok) {
      throw new Error('Failed to load recent audits');
    }
    const audits = await response.json();
    renderAudits(audits);
  } catch (error) {
    console.error(error);
    auditStatus.textContent = 'Unable to load recent audits.';
  }
}

function runAudit(url) {
  // Placeholder scan heuristic until a full scanner is implemented.
  const issueCount = Math.max(0, (url.match(/[^a-zA-Z0-9]/g) || []).length % 10);
  return { url, issueCount };
}

auditForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = urlInput.value.trim();

  if (!url) {
    return;
  }

  auditStatus.textContent = 'Running audit...';

  try {
    const { issueCount } = runAudit(url);

    const response = await fetch('/api/audits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, issueCount }),
    });

    if (!response.ok) {
      throw new Error('Failed to save audit');
    }

    const savedAudit = await response.json();
    auditStatus.textContent = `Audit complete: ${savedAudit.issueCount} issue(s) found.`;
    urlInput.value = '';

    await loadRecentAudits();
  } catch (error) {
    console.error(error);
    auditStatus.textContent = 'Audit failed. Please try again.';
  }
});

loadRecentAudits();
