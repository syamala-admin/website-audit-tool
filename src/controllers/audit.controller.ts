import { Request, Response } from 'express';
import { AuditService } from '../services/audit.service';

export class AuditController {
  private readonly service: AuditService;

  constructor(service: AuditService) {
    this.service = service;
  }

  getRecentAudits = (req: Request, res: Response): void => {
    try {
      const audits = this.service.getRecentAudits();
      res.status(200).json(audits);
    } catch (error) {
      console.error('Failed to retrieve recent audits');
      res.status(500).json({ error: 'Failed to retrieve recent audits' });
    }
  };

  createAudit = (req: Request, res: Response): void => {
    const { url, issueCount } = req.body ?? {};

    if (typeof url !== 'string' || url.trim().length === 0) {
      res.status(400).json({ error: 'url is required and must be a non-empty string' });
      return;
    }

    if (typeof issueCount !== 'number' || !Number.isInteger(issueCount) || issueCount < 0) {
      res.status(400).json({ error: 'issueCount is required and must be a non-negative integer' });
      return;
    }

    try {
      const audit = this.service.recordAudit(url.trim(), issueCount);
      res.status(201).json(audit);
    } catch (error) {
      console.error('Failed to save audit');
      res.status(500).json({ error: 'Failed to save audit' });
    }
  };
}
