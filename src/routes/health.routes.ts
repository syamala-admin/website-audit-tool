import { Router } from 'express';
import { HealthController } from '../controllers/health.controller';
import { HealthCheckService } from '../services/health-check.service';
import { BasicHealthCheck } from '../health-checks/basic.health-check';

export function createHealthRouter(): Router {
  const router = Router();

  // Dependency injection: HealthCheckService is composed of pluggable
  // IHealthCheck strategies and handed to the controller.
  const healthCheckService = new HealthCheckService([new BasicHealthCheck()]);
  const healthController = new HealthController(healthCheckService);

  router.get('/health', healthController.getHealth);

  return router;
}
