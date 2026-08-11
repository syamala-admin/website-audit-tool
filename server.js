const express = require('express');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store. Good enough for this small tool / e2e runs, which always
// start from an empty state per the CI contract (no seed data assumed).
let audits = [];
let nextId = 1;

app.post('/api/audits', (req, res) => {
  const { url, issueCount } = req.body || {};

  if (!url || typeof issueCount !== 'number') {
    return res.status(400).json({ error: 'url (string) and issueCount (number) are required' });
  }

  const audit = {
    id: nextId++,
    url,
    issueCount,
    createdAt: new Date().toISOString()
  };

  audits.push(audit);
  res.status(201).json(audit);
});

app.get('/api/audits', (req, res) => {
  // Most recent first.
  res.json(audits.slice().reverse());
});

// Total-audits count, surfaced on the Recent audits page.
app.get('/api/audits/count', (req, res) => {
  res.json({ count: audits.length });
});

const PORT = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${PORT}`);
  });
}

module.exports = app;
