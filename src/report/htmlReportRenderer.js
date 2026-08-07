'use strict';

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function severityBadge(severity) {
  const colors = { high: '#c0392b', medium: '#e67e22', low: '#2d7d46' };
  const color = colors[severity] || '#555';
  return `<span style="background:${color};color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;text-transform:uppercase;">${escapeHtml(severity)}</span>`;
}

/**
 * Renders a structured audit report as printable, self-contained HTML.
 */
function renderHtmlReport(report) {
  const rows = report.findings
    .map(
      (finding) => `
      <tr data-finding-id="${escapeHtml(finding.id)}">
        <td>${severityBadge(finding.severity)}</td>
        <td>${escapeHtml(finding.category)}</td>
        <td>${escapeHtml(finding.description)}</td>
        <td>${escapeHtml(finding.fix)}</td>
        <td><button class="create-task-btn" data-finding='${JSON.stringify(finding)}'>Create Task</button></td>
      </tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Audit Report — ${escapeHtml(report.url)}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 24px; color: #222; }
    h1 { font-size: 20px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; vertical-align: top; }
    th { background: #f4f4f4; }
    .summary span { margin-right: 12px; }
    @media print {
      .create-task-btn { display: none; }
    }
  </style>
</head>
<body>
  <h1>Website Audit Report</h1>
  <p><strong>URL:</strong> ${escapeHtml(report.url)}</p>
  <p><strong>Generated:</strong> ${escapeHtml(report.generatedAt)}</p>
  <p class="summary">
    <span>Total: ${report.summary.total}</span>
    <span>High: ${report.summary.high}</span>
    <span>Medium: ${report.summary.medium}</span>
    <span>Low: ${report.summary.low}</span>
  </p>
  <table>
    <thead>
      <tr>
        <th>Severity</th>
        <th>Category</th>
        <th>Description</th>
        <th>Suggested Fix</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      ${rows || '<tr><td colspan="5">No issues found.</td></tr>'}
    </tbody>
  </table>
</body>
</html>`;
}

module.exports = { renderHtmlReport };
