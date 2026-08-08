const { createFinding } = require('../utils/finding');

class ReachabilityCheck {
  constructor() {
    this.id = 'reachability';
    this.category = 'Technical';
  }

  run(doc, context) {
    const reachable = context.response.ok;

    return [createFinding({
      id: this.id,
      category: this.category,
      severity: reachable ? 'info' : 'high',
      passed: reachable,
      title: 'Page Reachability',
      description: reachable
        ? `The page was reached successfully (HTTP ${context.response.status}).`
        : `The page could not be reached${context.response.status ? ` (HTTP ${context.response.status})` : ''}${context.response.error ? `: ${context.response.error}` : ''}.`,
      suggestedFix: reachable
        ? 'No action needed.'
        : 'Verify the URL is correct, the server is online, and there are no DNS or firewall issues blocking access.',
    })];
  }
}

module.exports = ReachabilityCheck;
