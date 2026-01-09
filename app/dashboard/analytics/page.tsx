import { currentUser } from '@clerk/nextjs/server';
import { getAnalytics } from '@/lib/analytics/get-analytics';
import AnalyticsClient from './AnalyticsClient';

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { range?: string };
}) {
  const user = await currentUser();
  if (!user) throw new Error('Unauthorized');

  const range = searchParams.range ?? '7d';

  const analytics = await getAnalytics(user.id, range);

  return (
    <AnalyticsClient
      analytics={analytics}
      range={range}
    />
  );
}
