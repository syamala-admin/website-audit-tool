const TitleTagCheck = require('../../src/checks/TitleTagCheck');
const htmlParser = require('../../src/adapters/HtmlParser');

describe('TitleTagCheck', () => {
  const check = new TitleTagCheck();

  it('passes when a title tag is present', () => {
    const doc = htmlParser.parse('<title>My Page</title>');
    const [finding] = check.run(doc);
    expect(finding.passed).toBe(true);
  });

  it('fails when no title tag is present', () => {
    const doc = htmlParser.parse('<p>No title</p>');
    const [finding] = check.run(doc);
    expect(finding.passed).toBe(false);
    expect(finding.severity).toBe('high');
  });
});
