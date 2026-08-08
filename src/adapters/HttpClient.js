const { request } = require('undici');

class HttpClient {
  /**
   * Fetch a URL with timeout handling. Normalizes undici's API into a
   * simple result object so callers never need to know about undici.
   * @param {string} url
   * @param {number} timeoutMs
   * @returns {Promise<{ok: boolean, status: number|null, headers: object, body: string|null, error: string|null}>}
   */
  async fetch(url, timeoutMs = 10000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const { statusCode, headers, body } = await request(url, {
        method: 'GET',
        signal: controller.signal,
        headersTimeout: timeoutMs,
        bodyTimeout: timeoutMs,
      });

      const text = await body.text();

      return {
        ok: statusCode >= 200 && statusCode < 400,
        status: statusCode,
        headers,
        body: text,
        error: statusCode >= 400 ? `URL returned HTTP ${statusCode}` : null,
      };
    } catch (err) {
      const isTimeout = err.name === 'AbortError' || /timeout/i.test(err.message || '');
      return {
        ok: false,
        status: null,
        headers: {},
        body: null,
        error: isTimeout
          ? `connection timeout after ${timeoutMs / 1000} seconds`
          : (err.message || 'unknown network error'),
      };
    } finally {
      clearTimeout(timer);
    }
  }
}

module.exports = new HttpClient();
