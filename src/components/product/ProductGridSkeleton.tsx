import { Skeleton } from '../ui/Skeleton';

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex flex-col">
          <Skeleton className="aspect-[4/5] w-full rounded-[2rem] mb-4" />
          <div className="px-2 space-y-3">
            <div className="flex justify-between items-start gap-4">
              <Skeleton className="h-5 w-2/3 rounded-md" />
              <Skeleton className="h-5 w-16 rounded-md" />
            </div>
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-12 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}
