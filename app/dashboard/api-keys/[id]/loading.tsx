import { Card, CardContent, CardHeader } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 py-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-6 w-40 bg-slate-200 rounded mb-6" />

          <div className="flex items-center justify-between">
            <div>
              <div className="h-10 w-72 bg-slate-300 rounded mb-3" />
              <div className="h-4 w-80 bg-slate-200 rounded" />
            </div>
            <div className="h-8 w-24 bg-slate-300 rounded-full" />
          </div>
        </div>

        {/* Traffic Section */}
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />

        {/* Latency Metrics */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-9 w-9 bg-slate-300 rounded-lg" />
            <div className="h-7 w-64 bg-slate-300 rounded" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="h-4 w-32 bg-slate-200 rounded mx-auto" />
                  <div className="h-10 w-24 bg-slate-300 rounded mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Skeleton Helpers ---------- */

function SectionSkeleton() {
  return (
    <section className="mb-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-9 w-9 bg-slate-300 rounded-lg" />
        <div className="h-7 w-64 bg-slate-300 rounded" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-5 w-64 bg-slate-300 rounded mb-2" />
              <div className="h-4 w-48 bg-slate-200 rounded" />
            </CardHeader>
            <CardContent>
              <div className="h-[280px] w-full bg-slate-200 rounded-lg" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
