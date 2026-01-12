export interface AnalyticsMetrics {
  count: number;
  passed?: number;
  failed?: number;

  avgLatencyMs?: number;
  p95LatencyMs?: number;
}
