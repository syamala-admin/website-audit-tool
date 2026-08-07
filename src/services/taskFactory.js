'use strict';

const crypto = require('crypto');

/**
 * Factory pattern: ensures every task created from a finding has a
 * consistent ID format and field mapping. This is a placeholder for a
 * future project-management integration (e.g. Jira, Asana, Trello).
 */
class TaskFactory {
  createFromFinding(finding = {}) {
    return {
      id: `task_${crypto.randomBytes(8).toString('hex')}`,
      title: finding.description ? `Fix: ${finding.description}` : 'Untitled audit finding',
      severity: finding.severity || 'medium',
      category: finding.category || 'general',
      suggestedFix: finding.fix || '',
      sourceFindingId: finding.id || null,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
  }
}

module.exports = TaskFactory;
