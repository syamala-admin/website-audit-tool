import { Request, Response } from 'express';
import { HealthCheckService } from '../services/health-check.service';

/**
 * Encapsulates HTTP handling for the health endpoint, decoupled from the
 * underlying health check business logic (HealthCheckService is injected).
 */
export class HealthController {
  private readonly healthCheckService: HealthCheckService;

  constructor(healthCheckService: HealthCheckService) {
    this.healthCheckService = healthCheckService;
  }

  public getHealth = async (_req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.healthCheckService.getStatus();
      res.status(200).json(result);
    } catch (error) {
      console.error('Health check failed:', error instanceof Error ? error.message : 'Unknown error');
      res.status(500).json({ status: 'error' });
    }
  };
}
