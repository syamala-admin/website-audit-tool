export interface IHealthCheck {
  readonly name: string;
  check(): Promise<boolean>;
}
