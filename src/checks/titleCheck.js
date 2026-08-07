'use strict';

const Check = require('./checkInterface');

const MIN_LENGTH = 10;
const MAX_LENGTH = 60;

class TitleCheck extends Check {
  run(context) {
    const findings = [];
    const { $ } = context;
    if (!$) return findings;

    const title = $('title').first().text().trim();

    if (!title) {
      findings.push({
        id: 'seo-title-missing',
        category: 'seo',
        severity: 'high',
        description: 'The page is missing a <title> tag.',
        fix: 'Add a unique, descriptive <title> tag between 10 and 60 characters.',
      });
    } else if (title.length < MIN_LENGTH || title.length > MAX_LENGTH) {
      findings.push({
        id: 'seo-title-length',
        category: 'seo',
        severity: 'low',
        description: `The <title> tag is ${title.length} characters long, outside the recommended ${MIN_LENGTH}-${MAX_LENGTH} character range.`,
        fix: 'Rewrite the title tag to be concise and descriptive, ideally 10-60 characters.',
      });
    }

    return findings;
  }
}

module.exports = TitleCheck;
