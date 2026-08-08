const ContactFormCheck = require('../../src/checks/ContactFormCheck');
const htmlParser = require('../../src/adapters/HtmlParser');

describe('ContactFormCheck', () => {
  const check = new ContactFormCheck();

  it('flags missing forms', () => {
    const doc = htmlParser.parse('<p>No form here</p>');
    const findings = check.run(doc);
    expect(findings[0].passed).toBe(false);
  });

  it('validates action attribute and required fields', () => {
    const doc = htmlParser.parse(`
      <form action="/submit" method="post">
        <input name="email" type="email" required>
      </form>
    `);
    const findings = check.run(doc);
    const presence = findings.find((f) => f.id === 'contact-form');
    const action = findings.find((f) => f.id.startsWith('contact-form-action'));
    const required = findings.find((f) => f.id.startsWith('contact-form-required'));

    expect(presence.passed).toBe(true);
    expect(action.passed).toBe(true);
    expect(required.passed).toBe(true);
  });

  it('flags missing action attribute', () => {
    const doc = htmlParser.parse('<form><input name="email"></form>');
    const findings = check.run(doc);
    const action = findings.find((f) => f.id.startsWith('contact-form-action'));
    expect(action.passed).toBe(false);
  });
});
