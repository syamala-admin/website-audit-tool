'use strict';

/**
 * Adapter pattern: wraps the platform HTTP client (undici-powered global fetch
 * in Node 18+, falling back to node-fetch) so the rest of the app depends on a
 * single, simple interface instead of a specific HTTP library.
 */
class HttpClient {
  constructor({ timeoutMs = 8000 } = {}) {
    this.timeoutMs = timeoutMs;
    this.fetchImpl = typeof fetch === 'function' ? fetch : require('node-fetch');
  }

  async get(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const startedAt = Date.now();

    try {
      const response = await this.fetchImpl(url, {
        method: 'GET',
        redirect: 'follow',
        signal: controller.signal,
        headers: {
          'User-Agent': 'WebsiteAuditTool/1.0 (+https://example.com/audit-tool)',
        },
      });

      const body = await response.text();
      const elapsedMs = Date.now() - startedAt;

      return {
        ok: true,
        status: response.status,
        headers: response.headers,
        url: response.url || url,
        body,
        elapsedMs,
        error: null,
      };
    } catch (err) {
      const elapsedMs = Date.now() - startedAt;
      const timedOut = err.name === 'AbortError';

      return {
        ok: false,
        status: null,
        headers: null,
        url,
        body: null,
        elapsedMs,
        error: {
          message: timedOut ? `Request timed out after ${this.timeoutMs}ms` : err.message,
          timedOut,
        },
      };
    } finally {
      clearTimeout(timer);
    }
  }
}

module.exports = HttpClient;
