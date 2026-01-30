'use client';

export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted-bg rounded w-1/4" />
      <div className="h-4 bg-muted-bg rounded w-1/2" />
      <div className="space-y-3">
        <div className="h-32 bg-muted-bg rounded" />
        <div className="h-32 bg-muted-bg rounded" />
      </div>
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-6 bg-muted-bg rounded w-3/4 mb-4" />
      <div className="h-4 bg-muted-bg rounded w-full mb-2" />
      <div className="h-4 bg-muted-bg rounded w-2/3" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="card">
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-12 bg-muted-bg rounded animate-pulse" />
        ))}
      </div>
    </div>
  );
}
