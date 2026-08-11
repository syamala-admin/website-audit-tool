async function loadAuditCount() {
  try {
    const response = await fetch('/api/audits/count');
    if (!response.ok) return;
    const data = await response.json();
    const el = document.getElementById('audit-count-value');
    if (el && typeof data.count === 'number') {
      el.textContent = String(data.count);
    }
  } catch (err) {
    // Non-fatal: leave the default count value in place.
    // eslint-disable-next-line no-console
    console.error('Failed to load audit count', err);
  }
}

async function loadAudits() {
  try {
    const response = await fetch('/api/audits');
    if (!response.ok) return;
    const audits = await response.json();
    const list = document.getElementById('audit-list');
    if (!list) return;
    list.innerHTML = '';
    audits.forEach((audit) => {
      const item = document.createElement('li');
      item.textContent = `${audit.url} - ${audit.issueCount} issues`;
      list.appendChild(item);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to load audits', err);
  }
}

loadAuditCount();
loadAudits();
