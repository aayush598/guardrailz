export const dynamic = 'force-dynamic';

import { requireAuth } from '@/shared/auth';
import { AnalyticsQueryService } from '@/modules/analytics';
import type { AnalyticsReadModel } from '@/modules/analytics';
import AnalyticsClient from './AnalyticsClient';

const analyticsQuery = new AnalyticsQueryService();

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { range?: '7d' | '30d' | '90d' };
}) {
  const { dbUser } = await requireAuth();

  const analytics: AnalyticsReadModel = await analyticsQuery.getDashboardAnalytics({
    userId: dbUser.id,
    from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    to: new Date(),
  });

  return <AnalyticsClient analytics={analytics} range={searchParams.range ?? '7d'} />;
}
