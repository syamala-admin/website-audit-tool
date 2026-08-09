import express, { Express } from 'express';
import { createHealthRouter } from './routes/health.routes';

export function createApp(): Express {
  const app = express();

  app.use(createHealthRouter());

  return app;
}
