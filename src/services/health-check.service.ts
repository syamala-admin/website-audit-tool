import { IHealthCheck } from '../interfaces/health-check.interface';

export interface HealthStatus {
  status: 'ok' | 'error';
}

/**
 * Composes pluggable IHealthCheck strategies. New checks can be injected
 * via the constructor without changing this service or the controller.
 */
export class HealthCheckService {
  private readonly checks: IHealthCheck[];

  constructor(checks: IHealthCheck[] = []) {
    this.checks = checks;
  }

  public async getStatus(): Promise<HealthStatus> {
    for (const check of this.checks) {
      const isHealthy = await check.check();
      if (!isHealthy) {
        return { status: 'error' };
      }
    }

    return { status: 'ok' };
  }
}
