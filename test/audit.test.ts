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

function buildTestApp(): Express {
  const db = createTestDatabase();
  const repository = new AuditRepository(db);
  const service = new AuditService(repository);
  const controller = new AuditController(service);

  const app = express();
  app.use(express.json());
  app.use('/api/audits', createAuditRoutes(controller));

  return app;
}

describe('AuditRepository', () => {
  it('stores and retrieves audit records once the migration has run', () => {
    const db = createTestDatabase();
    const repository = new AuditRepository(db);

    const record = repository.insert('https://example.com', 3, '2024-01-01T00:00:00.000Z');

    expect(record.url).toBe('https://example.com');
    expect(record.issueCount).toBe(3);
    expect(repository.findRecent(10)).toHaveLength(1);
  });

  it('returns audits newest first, limited to the requested count', () => {
    const db = createTestDatabase();
    const repository = new AuditRepository(db);

    repository.insert('https://a.com', 1, '2024-01-01T00:00:00.000Z');
    repository.insert('https://b.com', 2, '2024-01-02T00:00:00.000Z');
    repository.insert('https://c.com', 3, '2024-01-03T00:00:00.000Z');

    const recent = repository.findRecent(2);

    expect(recent).toHaveLength(2);
    expect(recent[0].url).toBe('https://c.com');
    expect(recent[1].url).toBe('https://b.com');
  });
});

describe('AuditService', () => {
  it('caps recent audits at 10', () => {
    const db = createTestDatabase();
    const repository = new AuditRepository(db);
    const service = new AuditService(repository);

    for (let i = 0; i < 15; i += 1) {
      service.recordAudit(`https://site${i}.com`, i);
    }

    expect(service.getRecentAudits()).toHaveLength(10);
  });
});

describe('DELETE /api/audits/:id', () => {
  it('deletes an existing audit and returns 200 with {deleted:true}', async () => {
    const app = buildTestApp();
    const db = createTestDatabase();
    const repository = new AuditRepository(db);
    
    const audit = repository.insert('https://example.com', 3, '2024-01-01T00:00:00.000Z');
    
    const service = new AuditService(repository);
    const controller = new AuditController(service);
    
    const testApp = express();
    testApp.use(express.json());
    testApp.use('/api/audits', createAuditRoutes(controller));
    
    const response = await request(testApp)
      .delete(`/api/audits/${audit.id}`)
      .expect(200);
    
    expect(response.body).toEqual({ deleted: true });
    expect(repository.findRecent(10)).toHaveLength(0);
  });

  it('returns 404 when audit does not exist', async () => {
    const app = buildTestApp();
    
    const response = await request(app)
      .delete('/api/audits/999')
      .expect(404);
    
    expect(response.body).toHaveProperty('error');
  });

  it('returns 400 when id is not a positive integer', async () => {
    const app = buildTestApp();
    
    const response = await request(app)
      .delete('/api/audits/invalid')
      .expect(400);
    
    expect(response.body).toHaveProperty('error');
  });
});

describe('GET /api/audits', () => {
  it('returns an empty array when no audits exist', async () => {
    const app = buildTestApp();

    const response = await request(app).get('/api/audits');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('returns the 10 most recent audits, newest first', async () => {
    const app = buildTestApp();

    for (let i = 0; i < 12; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await request(app).post('/api/audits').send({ url: `https://site${i}.com`, issueCount: i });
    }

    const response = await request(app).get('/api/audits');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(10);
    expect(response.body[0].url).toBe('https://site11.com');
    expect(response.body[0]).toHaveProperty('issueCount');
    expect(response.body[0]).toHaveProperty('createdAt');
  });
});

describe('POST /api/audits', () => {
  it('persists a completed audit', async () => {
    const app = buildTestApp();

    const response = await request(app)
      .post('/api/audits')
      .send({ url: 'https://example.com', issueCount: 5 });

    expect(response.status).toBe(201);
    expect(response.body.url).toBe('https://example.com');
    expect(response.body.issueCount).toBe(5);
    expect(response.body.createdAt).toBeDefined();
  });

  it('rejects a missing url', async () => {
    const app = buildTestApp();

    const response = await request(app).post('/api/audits').send({ issueCount: 5 });

    expect(response.status).toBe(400);
  });

  it('rejects a negative issue count', async () => {
    const app = buildTestApp();

    const response = await request(app)
      .post('/api/audits')
      .send({ url: 'https://example.com', issueCount: -1 });

    expect(response.status).toBe(400);
  });
});
