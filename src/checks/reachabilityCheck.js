'use strict';

const Check = require('./checkInterface');

class ReachabilityCheck extends Check {
  run(context) {
    const findings = [];
    const { fetchResult } = context;

    if (!fetchResult.ok) {
      const description = fetchResult.error && fetchResult.error.timedOut
        ? 'The page did not respond before the request timed out.'
        : `The page could not be reached: ${(fetchResult.error && fetchResult.error.message) || 'unknown error'}.`;

      findings.push({
        id: 'technical-reachability',
        category: 'technical',
        severity: 'high',
        description,
        fix: 'Confirm the URL is correct, the server is online, and DNS/hosting is configured correctly.',
      });
    } else if (fetchResult.status >= 400) {
      findings.push({
        id: 'technical-http-status',
        category: 'technical',
        severity: 'high',
        description: `The page returned an HTTP ${fetchResult.status} error status.`,
        fix: 'Investigate the server error/routing issue and ensure the page returns a 200 status.',
      });
    }

    return findings;
  }
}

module.exports = ReachabilityCheck;
