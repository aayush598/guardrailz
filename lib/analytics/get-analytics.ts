import { db } from '@/lib/db';

/* Replace with real queries */
export async function getAnalytics(userId: string, range: string) {
  return {
    overview: {
      totalExecutions: 12034,
      totalPassed: 11020,
      totalFailed: 1014,
      avgExecutionTime: 84,
      successRate: 91.6,
      changeFromLastPeriod: {
        executions: 12.4,
        successRate: 1.2,
        avgTime: -3.1,
      },
    },
    hourlyDistribution: [],
    guardrailStats: [],
    profileStats: [],
    topErrors: [],
  };
}
