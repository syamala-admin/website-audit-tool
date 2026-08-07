'use strict';

const Check = require('./checkInterface');

const MIN_LENGTH = 50;
const MAX_LENGTH = 160;

class MetaDescriptionCheck extends Check {
  run(context) {
    const findings = [];
    const { $ } = context;
    if (!$) return findings;

    const raw = $('meta[name="description"]').attr('content');
    const description = raw ? raw.trim() : '';

    if (!description) {
      findings.push({
        id: 'seo-meta-description-missing',
        category: 'seo',
        severity: 'high',
        description: 'The page is missing a meta description tag.',
        fix: 'Add a <meta name="description"> tag summarizing the page in 50-160 characters.',
      });
    } else if (description.length < MIN_LENGTH || description.length > MAX_LENGTH) {
      findings.push({
        id: 'seo-meta-description-length',
        category: 'seo',
        severity: 'low',
        description: `The meta description is ${description.length} characters long, outside the recommended ${MIN_LENGTH}-${MAX_LENGTH} character range.`,
        fix: 'Rewrite the meta description to be between 50 and 160 characters.',
      });
    }

    return findings;
  }
}

module.exports = MetaDescriptionCheck;
