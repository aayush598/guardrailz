import { Card, CardContent } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-slate-200">
          <CardContent className="pt-6 space-y-4">
            <div className="h-10 w-10 bg-slate-200 rounded-xl animate-pulse" />
            <div className="h-6 w-2/3 bg-slate-200 rounded animate-pulse" />
            <div className="h-4 w-1/2 bg-slate-100 rounded animate-pulse" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
