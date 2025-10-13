import { useFearGreedIndex } from "@/hooks/useFearGreedIndex";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export const FearGreedIndex = () => {
  const { data, isLoading } = useFearGreedIndex();

  const getColor = (value: number) => {
    if (value <= 25) return "text-red-500";
    if (value <= 45) return "text-orange-500";
    if (value <= 55) return "text-yellow-500";
    if (value <= 75) return "text-green-500";
    return "text-emerald-500";
  };

  const getIcon = (classification: string) => {
    if (classification.includes("Greed")) return <TrendingUp className="w-5 h-5" />;
    if (classification.includes("Fear")) return <TrendingDown className="w-5 h-5" />;
    return <Minus className="w-5 h-5" />;
  };

  if (isLoading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle>Fear & Greed Index</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const value = parseInt(data.value);

  return (
    <Card className="animate-fade-in hover-scale">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Fear & Greed Index
          {getIcon(data.value_classification)}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-center">
            <div className={`text-5xl font-bold ${getColor(value)}`}>
              {value}
            </div>
            <div className="text-sm text-muted-foreground mt-2">
              {data.value_classification}
            </div>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                value <= 25 ? "bg-red-500" :
                value <= 45 ? "bg-orange-500" :
                value <= 55 ? "bg-yellow-500" :
                value <= 75 ? "bg-green-500" :
                "bg-emerald-500"
              }`}
              style={{ width: `${value}%` }}
            />
          </div>
          <div className="grid grid-cols-5 gap-1 text-xs text-center text-muted-foreground">
            <div>Extreme Fear</div>
            <div>Fear</div>
            <div>Neutral</div>
            <div>Greed</div>
            <div>Extreme Greed</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
