# Website Audit Tool

Scans a website URL and returns a technical/SEO/form/tracking issue report with
severities and suggested fixes.

## Features

- Simple web form to submit a URL
- Technical checks: HTTPS, reachability/timeouts, mobile viewport, image alt text
- SEO checks: title tag, meta description, H1 count, canonical tag, heading structure
- Form check: detects contact/lead forms and validates action + required fields
- Tracking check: detects Google Analytics, GTM, Facebook Pixel, and other common snippets
- Structured JSON report + clean, printable HTML report
- Stub `POST /tasks` endpoint to "create a task" from a finding (mock task id, placeholder
  for a future project-management integration)

## Architecture

- **Adapter pattern** — `src/adapters/httpClient.js` and `src/adapters/htmlParser.js` wrap
  the HTTP client (`fetch`/`node-fetch`) and HTML parser (`cheerio`) so the rest of the app
  isn't coupled to a specific library.
- **Strategy pattern** — each audit rule (`src/checks/*.js`) implements a common `Check`
  interface (`run(context)` → findings[]) so the orchestrator can run them uniformly.
- **Repository pattern** — `src/repositories/auditCheckRepository.js` isolates the set of
  available checks so they can be added/removed without touching the orchestrator.
- **Builder pattern** — `src/report/auditReportBuilder.js` accumulates findings from every
  check and assembles the final structured report.
- **Factory pattern** — `src/services/taskFactory.js` ensures every task created from a
  finding has a consistent ID and field mapping.
- **Separation of concerns** — `AuditController` (HTTP) → `AuditService` (orchestration) →
  `Check` classes (domain logic).

## Getting started

```bash
npm install
npm start
```

Then open http://localhost:3000 in a browser, enter a URL, and click **Audit**.

## API

### `POST /api/audit`

Request:

```json
{ "url": "https://example.com" }
```

Response:

```json
{
  "report": {
    "url": "https://example.com",
    "generatedAt": "2024-01-01T00:00:00.000Z",
    "summary": { "total": 3, "high": 1, "medium": 1, "low": 1 },
    "findings": [
      {
        "id": "seo-title-missing",
        "category": "seo",
        "severity": "high",
        "description": "The page is missing a <title> tag.",
        "fix": "Add a unique, descriptive <title> tag between 10 and 60 characters."
      }
    ]
  },
  "htmlReport": "<!DOCTYPE html>..."
}
```

### `POST /tasks`

Request:

```json
{ "finding": { "id": "seo-title-missing", "severity": "high", "description": "...", "fix": "..." } }
```

Response:

```json
{
  "task": {
    "id": "task_ab12cd34ef56ab78",
    "title": "Fix: ...",
    "severity": "high",
    "category": "seo",
    "suggestedFix": "...",
    "sourceFindingId": "seo-title-missing",
    "status": "open",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Timeout & HTTPS handling

- The HTTP client adapter enforces a request timeout (default 8s) and, on abort/timeout,
  the `ReachabilityCheck` reports a high-severity "page unreachable" finding instead of
  crashing the request.
- The `HttpsCheck` inspects the final resolved URL's scheme; if the site is served over
  plain HTTP (no valid TLS), it is flagged as a high-severity technical issue.

## Tests

```bash
npm test
```

Unit tests cover the individual check classes (`test/checks.test.js`).
