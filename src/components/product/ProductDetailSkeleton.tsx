import { Skeleton } from '../ui/Skeleton';

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 sm:py-16">
      <Skeleton className="h-6 w-32 mb-8 rounded-lg" />
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <Skeleton className="w-full aspect-[4/5] sm:aspect-square rounded-[2.5rem]" />
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-24 h-24 shrink-0 rounded-2xl" />
            ))}
          </div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col">
          <Skeleton className="h-6 w-1/4 mb-4 rounded-lg" />
          <Skeleton className="h-14 w-3/4 mb-6 rounded-xl" />
          <Skeleton className="h-12 w-40 mb-10 rounded-xl" />
          <div className="space-y-4 mb-12">
            <Skeleton className="h-5 w-full rounded-lg" />
            <Skeleton className="h-5 w-full rounded-lg" />
            <Skeleton className="h-5 w-4/5 rounded-lg" />
          </div>
          <Skeleton className="h-16 w-full rounded-2xl mb-12" />
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-24 w-full rounded-2xl" />
            <Skeleton className="h-24 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
