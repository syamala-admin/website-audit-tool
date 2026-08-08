/**
 * Creates a normalized finding object used by every check.
 * @param {object} params
 * @param {string} params.id
 * @param {string} params.category
 * @param {'high'|'medium'|'low'|'info'} params.severity
 * @param {boolean} params.passed
 * @param {string} params.title
 * @param {string} params.description
 * @param {string} params.suggestedFix
 */
function createFinding({ id, category, severity, passed, title, description, suggestedFix }) {
  return { id, category, severity, passed, title, description, suggestedFix };
}

module.exports = { createFinding };
