import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';

export function createAuditRoutes(controller: AuditController): Router {
  const router = Router();

  router.get('/', controller.getRecentAudits);
  router.post('/', controller.createAudit);

  return router;
}
