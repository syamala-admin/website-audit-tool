import express, { Express } from 'express';
import path from 'path';
import { createHealthRouter } from './routes/health.routes';
import { createAuditRoutes } from './routes/audit.routes';
import { AuditRepository } from './repositories/audit.repository';
import { AuditService } from './services/audit.service';
import { AuditController } from './controllers/audit.controller';
import { createDatabase } from './db/database';

/**
 * Factory that builds a fresh Express app without starting a listener,
 * so tests can import a clean instance per run (see src/index.ts).
 */
export function createApp(): Express {
  const app: Express = express();

  app.use(express.json());
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.use(createHealthRouter());

  const database = createDatabase();
  const auditRepository = new AuditRepository(database);
  const auditService = new AuditService(auditRepository);
  const auditController = new AuditController(auditService);

  app.use('/api/audits', createAuditRoutes(auditController));

  return app;
}
