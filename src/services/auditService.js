'use strict';

const HttpClient = require('../adapters/httpClient');
const HtmlParser = require('../adapters/htmlParser');
const AuditCheckRepository = require('../repositories/auditCheckRepository');
const AuditReportBuilder = require('../report/auditReportBuilder');
const { renderHtmlReport } = require('../report/htmlReportRenderer');

/**
 * AuditService orchestrates the audit: fetches the page, parses it, runs
 * every check (Strategy pattern) sourced from the AuditCheckRepository, and
 * assembles the final report using AuditReportBuilder.
 */
class AuditService {
  constructor({ httpClient, htmlParser, checkRepository } = {}) {
    this.httpClient = httpClient || new HttpClient();
    this.htmlParser = htmlParser || new HtmlParser();
    this.checkRepository = checkRepository || new AuditCheckRepository();
  }

  normalizeUrl(rawUrl) {
    if (!rawUrl) return null;
    const trimmed = rawUrl.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      return `https://${trimmed}`;
    }
    return trimmed;
  }

  async runAudit(rawUrl) {
    const url = this.normalizeUrl(rawUrl);
    if (!url) {
      throw new Error('A website URL is required.');
    }

    const fetchResult = await this.httpClient.get(url);
    const html = fetchResult.body || '';
    const $ = fetchResult.ok ? this.htmlParser.parse(html) : null;

    const context = {
      url,
      finalUrl: fetchResult.url,
      fetchResult,
      html,
      $,
    };

    const builder = new AuditReportBuilder(url);
    const checks = this.checkRepository.getAll();
    for (let i = 0; i < checks.length; i += 1) {
      const findings = checks[i].run(context) || [];
      builder.addFindings(findings);
    }

    const report = builder.build();
    const htmlReport = renderHtmlReport(report);

    return { report, htmlReport };
  }
}

module.exports = AuditService;
