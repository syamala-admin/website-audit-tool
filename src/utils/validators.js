/**
 * Server-side URL validation. Must mirror any client-side validation
 * so we never trust client-only checks.
 * @param {string} value
 * @returns {boolean}
 */
function isValidUrl(value) {
  if (!value || typeof value !== 'string') return false;

  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

module.exports = { isValidUrl };
