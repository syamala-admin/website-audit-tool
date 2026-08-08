const { createFinding } = require('../utils/finding');

class ContactFormCheck {
  constructor() {
    this.id = 'contact-form';
    this.category = 'Forms';
  }

  run(doc) {
    const forms = doc.getForms();
    const findings = [];

    findings.push(createFinding({
      id: this.id,
      category: this.category,
      severity: forms.length > 0 ? 'info' : 'medium',
      passed: forms.length > 0,
      title: 'Contact/Lead Form Presence',
      description: forms.length > 0
        ? `Found ${forms.length} form(s) on the page.`
        : 'No contact or lead capture form was found on the page.',
      suggestedFix: forms.length > 0
        ? 'No action needed.'
        : 'Add a contact or lead capture form so visitors can get in touch or submit inquiries.',
    }));

    forms.forEach((form, index) => {
      const hasAction = Boolean(form.action && form.action.trim());
      const requiredFields = form.inputs.filter((input) => input.required);
      const hasRequiredFields = requiredFields.length > 0;

      findings.push(createFinding({
        id: `${this.id}-action-${index}`,
        category: this.category,
        severity: hasAction ? 'info' : 'medium',
        passed: hasAction,
        title: `Form #${index + 1} Action Attribute`,
        description: hasAction
          ? `Form #${index + 1} has a valid action attribute.`
          : `Form #${index + 1} is missing an action attribute, so submissions may not be sent anywhere.`,
        suggestedFix: hasAction
          ? 'No action needed.'
          : 'Add an action attribute pointing to the endpoint that should process the form submission.',
      }));

      findings.push(createFinding({
        id: `${this.id}-required-${index}`,
        category: this.category,
        severity: hasRequiredFields ? 'info' : 'low',
        passed: hasRequiredFields,
        title: `Form #${index + 1} Required Fields`,
        description: hasRequiredFields
          ? `Form #${index + 1} has ${requiredFields.length} required field(s).`
          : `Form #${index + 1} has no required fields, which may lead to incomplete submissions.`,
        suggestedFix: hasRequiredFields
          ? 'No action needed.'
          : 'Mark key fields (such as name and email) as required to reduce incomplete submissions.',
      }));
    });

    return findings;
  }
}

module.exports = ContactFormCheck;
