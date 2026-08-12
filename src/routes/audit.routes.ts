import { Router } from 'express';
import { AuditController } from '../controllers/audit.controller';

export function createAuditRoutes(controller: AuditController): Router {
  const router = Router();

  router.get('/', controller.getRecentAudits);
  router.get('/count', controller.getAuditCount);
  router.post('/', controller.createAudit);
  router.delete('/:id', controller.deleteAudit);

  return router;
}
