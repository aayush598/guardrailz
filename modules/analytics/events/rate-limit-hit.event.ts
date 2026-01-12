export interface RateLimitHitPayload {
  limitType: 'minute' | 'day';
  current: number;
  max: number;
}

export const RATE_LIMIT_HIT_EVENT = 'rate_limit.hit';
