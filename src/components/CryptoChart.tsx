import { useCryptoChart } from "@/hooks/useCryptoChart";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

interface CryptoChartProps {
  coinId: string;
  isPositive: boolean;
}

export const CryptoChart = ({ coinId, isPositive }: CryptoChartProps) => {
  const [days, setDays] = useState<number>(7);
  const { data: chartData, isLoading } = useCryptoChart(coinId, days);

  const chartConfig = {
    price: {
      label: "Price",
      color: isPositive ? "hsl(var(--success))" : "hsl(var(--destructive))",
    },
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    if (days === 1) {
      return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatPrice = (price: number) => {
    return `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  if (isLoading) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  const formattedData = chartData?.map((item) => ({
    date: formatDate(item.timestamp),
    price: item.price,
  })) || [];

  return (
    <div className="space-y-4">
      <Tabs value={days.toString()} onValueChange={(v) => setDays(Number(v))}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="1">24h</TabsTrigger>
          <TabsTrigger value="7">7d</TabsTrigger>
          <TabsTrigger value="30">30d</TabsTrigger>
          <TabsTrigger value="365">1y</TabsTrigger>
        </TabsList>
        <TabsContent value={days.toString()} className="mt-4">
          <ChartContainer config={chartConfig} className="h-[300px] w-full">
            <AreaChart data={formattedData}>
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={chartConfig.price.color}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={chartConfig.price.color}
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              <XAxis
                dataKey="date"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatPrice}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[150px]"
                    nameKey="price"
                    labelFormatter={(value) => value}
                  />
                }
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={chartConfig.price.color}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
            </AreaChart>
          </ChartContainer>
        </TabsContent>
      </Tabs>
    </div>
  );
};
