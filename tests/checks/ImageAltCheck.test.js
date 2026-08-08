const ImageAltCheck = require('../../src/checks/ImageAltCheck');
const htmlParser = require('../../src/adapters/HtmlParser');

describe('ImageAltCheck', () => {
  const check = new ImageAltCheck();

  it('passes when all images have alt text', () => {
    const doc = htmlParser.parse('<img src="a.jpg" alt="A description">');
    const [finding] = check.run(doc);
    expect(finding.passed).toBe(true);
  });

  it('fails when an image is missing alt text', () => {
    const doc = htmlParser.parse('<img src="a.jpg" alt="ok"><img src="b.jpg">');
    const [finding] = check.run(doc);
    expect(finding.passed).toBe(false);
    expect(finding.severity).toBe('medium');
  });

  it('passes when there are no images', () => {
    const doc = htmlParser.parse('<p>No images here</p>');
    const [finding] = check.run(doc);
    expect(finding.passed).toBe(true);
  });
});
