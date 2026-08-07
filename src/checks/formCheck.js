'use strict';

const Check = require('./checkInterface');

class FormCheck extends Check {
  run(context) {
    const findings = [];
    const { $ } = context;
    if (!$) return findings;

    const forms = $('form');

    if (forms.length === 0) {
      findings.push({
        id: 'form-missing',
        category: 'form',
        severity: 'medium',
        description: 'No contact or lead capture form was detected on the page.',
        fix: 'Add a contact/lead form so visitors can get in touch or request more information.',
      });
      return findings;
    }

    let hasFormWithAction = false;
    let hasFormWithRequiredFields = false;

    forms.each((_, el) => {
      const $form = $(el);
      const action = $form.attr('action');
      const requiredFields = $form.find('[required]');

      if (action && action.trim() !== '') {
        hasFormWithAction = true;
      }
      if (requiredFields.length > 0) {
        hasFormWithRequiredFields = true;
      }
    });

    if (!hasFormWithAction) {
      findings.push({
        id: 'form-missing-action',
        category: 'form',
        severity: 'medium',
        description: 'A form was found but none specify a submission action/endpoint.',
        fix: 'Ensure the form has a valid action attribute (or JS submit handler) so submissions are actually sent somewhere.',
      });
    }

    if (!hasFormWithRequiredFields) {
      findings.push({
        id: 'form-missing-required-fields',
        category: 'form',
        severity: 'low',
        description: 'The form(s) found do not mark any fields as required.',
        fix: 'Mark key fields (e.g. name, email) as required to reduce incomplete submissions.',
      });
    }

    return findings;
  }
}

module.exports = FormCheck;
