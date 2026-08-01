export default function MarketingLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page skeleton */}
      <div className="relative">
        <HeroSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
      </div>
    </div>
  );
}

/* ---------- Skeleton Components ---------- */

function HeroSkeleton() {
  return (
    <section className="py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-2">
        <div className="space-y-6">
          <Skeleton className="h-8 w-56 rounded-full" />
          <Skeleton className="h-14 w-full max-w-xl" />
          <Skeleton className="h-14 w-5/6" />
          <Skeleton className="h-6 w-4/5" />

          <div className="flex gap-4 pt-4">
            <Skeleton className="h-14 w-44 rounded-xl" />
            <Skeleton className="h-14 w-44 rounded-xl" />
          </div>
        </div>

        <Skeleton className="h-[420px] rounded-3xl" />
      </div>
    </section>
  );
}

function SectionSkeleton() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 space-y-4 text-center">
          <Skeleton className="mx-auto h-6 w-40 rounded-full" />
          <Skeleton className="mx-auto h-10 w-2/3" />
          <Skeleton className="mx-auto h-6 w-1/2" />
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-2xl" />
          ))}
        </div>
      </div>
    </section>
  );
}

function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100 ${className}`}
    />
  );
}
