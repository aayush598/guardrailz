import { Card, CardContent } from '@/components/ui/card';

export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6 space-y-3">
              <div className="h-4 w-1/2 bg-slate-200 rounded animate-pulse" />
              <div className="h-8 w-1/3 bg-slate-300 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="py-16 text-center">
          <div className="h-6 w-48 bg-slate-200 mx-auto rounded animate-pulse" />
        </CardContent>
      </Card>
    </div>
  );
}
