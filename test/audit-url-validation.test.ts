import request from 'supertest';
import express, { Express } from 'express';
import Database from 'better-sqlite3';
import { runMigrations } from '../src/db/migrate';
import { AuditRepository } from '../src/repositories/audit.repository';
import { AuditService } from '../src/services/audit.service';
import { AuditController } from '../src/controllers/audit.controller';
import { createAuditRoutes } from '../src/routes/audit.routes';

function createTestDatabase(): Database.Database {
  const db = new Database(':memory:');
  runMigrations(db);
  return db;
}

function buildTestApp(db: Database.Database): Express {
  const repository = new AuditRepository(db);
  const service = new AuditService(repository);
  const controller = new AuditController(service);

  const app = express();
  app.use(express.json());
  app.use('/api/audits', createAuditRoutes(controller));

  return app;
}

describe('POST /api/audits - URL validation', () => {
  it('rejects an invalid url with 400 and creates nothing', async () => {
    const db = createTestDatabase();
    const app = buildTestApp(db);

    const response = await request(app)
      .post('/api/audits')
      .send({ url: 'not-a-url', issueCount: 2 });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('error');

    const repository = new AuditRepository(db);
    expect(repository.findRecent(10)).toHaveLength(0);
  });

  it('still succeeds for a valid url', async () => {
    const db = createTestDatabase();
    const app = buildTestApp(db);

    const response = await request(app)
      .post('/api/audits')
      .send({ url: 'https://example.com', issueCount: 2 });

    expect(response.status).toBe(201);
    expect(response.body.url).toBe('https://example.com');

    const repository = new AuditRepository(db);
    expect(repository.findRecent(10)).toHaveLength(1);
  });
});
