import { IHealthCheck } from '../interfaces/health-check.interface';

/**
 * Baseline health check strategy. Always reports healthy.
 * Additional strategies (database, cache, external APIs) can implement
 * IHealthCheck and be plugged into HealthCheckService without modifying
 * the /health endpoint.
 */
export class BasicHealthCheck implements IHealthCheck {
  public readonly name = 'basic';

  public async check(): Promise<boolean> {
    return true;
  }
}
