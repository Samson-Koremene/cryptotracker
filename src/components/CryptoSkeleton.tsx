import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const CryptoSkeleton = () => {
  return (
    <Card className="glass-card p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-6 w-16" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-9 w-32" />
        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/50">
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>
    </Card>
  );
};
