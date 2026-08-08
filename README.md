# Website Audit Tool

Automated website audit tool that scans a submitted URL and reports technical, SEO, form, and tracking issues. Built with Node.js, Express, undici, and cheerio.

## Features

- Submit a URL via a simple web form
- Fetches the target URL with a 10-second timeout and handles unreachable sites gracefully
- Runs a suite of independent checks (Strategy pattern), including:
  - HTTPS enabled
  - Page reachability
  - Mobile viewport meta tag
  - Image alt text
  - Title tag
  - Meta description
  - Exactly one H1 tag
  - Heading structure (no skipped levels)
  - Canonical tag
  - Contact/lead form presence, action attribute, and required fields
  - Google Analytics / Google Tag Manager / Facebook Pixel tracking
- Each finding includes a severity (`high`/`medium`/`low`/`info`), plain-language description, and suggested fix
- Report available in JSON and clean, printable HTML formats
- Save a report's findings as a mock task via `POST /tasks`
- Everything runs locally — no paid external APIs

## Architecture

- **adapters/** — `HttpClient.js` (undici) and `HtmlParser.js` (cheerio) normalize third-party libraries into domain-friendly interfaces
- **checks/** — one Strategy class per check, all sharing a `run(doc, context)` interface; `CheckFactory.js` wires them into a suite
- **repository/** — `ReportRepository.js` and `TaskRepository.js` provide in-memory storage for MVP, designed to be swapped for a persistent store later
- **services/** — `AuditService.js` orchestrates fetching, parsing, running checks, and building the report
- **controllers/** and **routes/** — thin Express layer that validates input and delegates to services

## Getting Started

```bash
npm install
npm start
```

The app will be available at `http://localhost:3000`.

## Running Tests

```bash
npm test
```

## API

### `POST /audit`

Request body:
```json
{ "url": "https://example.com" }
```

Response (200): a report object with `id`, `url`, `timestamp`, `findings`, `summary`, and `html`.

Response (400): `{ "error": true, "message": "...", "url": "..." }` when the URL is invalid, unreachable, or times out.

### `GET /audit/:id`

Returns a previously generated report by ID.

### `POST /tasks`

Request body:
```json
{ "reportId": "...", "url": "...", "findings": [...] }
```

Response (201): `{ "taskId": "...", "task": { ... } }`

## Notes

- All checks run locally against fetched HTML; no external paid APIs are used.
- Reports are stored in-memory for the duration of the server process (MVP scope).
