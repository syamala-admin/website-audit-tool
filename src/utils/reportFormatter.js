function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function severityLabel(severity) {
  const labels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
    info: 'Info',
  };
  return labels[severity] || severity;
}

/**
 * Renders a report object into a clean, printable HTML fragment.
 * @param {object} report
 * @returns {string}
 */
function toHtml(report) {
  const rows = report.findings.map((finding) => `
    <tr class="finding finding--${finding.severity} ${finding.passed ? 'finding--passed' : 'finding--failed'}">
      <td>${escapeHtml(finding.category)}</td>
      <td>${escapeHtml(finding.title)}</td>
      <td><span class="badge badge--${finding.severity}">${severityLabel(finding.severity)}</span></td>
      <td>${finding.passed ? 'Pass' : 'Fail'}</td>
      <td>${escapeHtml(finding.description)}</td>
      <td>${escapeHtml(finding.suggestedFix)}</td>
    </tr>
  `).join('');

  return `
    <div class="audit-report">
      <h2>Audit Report for ${escapeHtml(report.url)}</h2>
      <p class="audit-report__meta">Generated: ${escapeHtml(report.timestamp)}</p>
      <table class="audit-report__table">
        <thead>
          <tr>
            <th>Category</th>
            <th>Check</th>
            <th>Severity</th>
            <th>Status</th>
            <th>Description</th>
            <th>Suggested Fix</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
  `;
}

module.exports = { toHtml };
