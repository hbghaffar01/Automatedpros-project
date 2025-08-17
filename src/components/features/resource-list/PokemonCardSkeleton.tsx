import { Skeleton } from '@/components/common/Skeleton';

export function PokemonCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <Skeleton className="aspect-square" />
      <div className="p-4">
        <Skeleton className="h-4 w-12 mb-2" />
        <Skeleton className="h-6 w-32 mb-3" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>
    </div>
  );
}
