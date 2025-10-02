import { useGlobalStats } from "@/hooks/useGlobalStats";
import { TrendingUp, TrendingDown, Activity, DollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const MarketOverview = () => {
  const { data: stats, isLoading } = useGlobalStats();

  const formatNumber = (num: number) => {
    if (num >= 1e12) return `$${(num / 1e12).toFixed(2)}T`;
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    return `$${num.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-4 rounded-lg border border-border/30">
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-6 w-32" />
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const isPositiveChange = stats.market_cap_change_percentage_24h_usd >= 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="glass-card p-4 rounded-lg border border-border/30 hover-scale">
        <div className="flex items-center gap-2 mb-2">
          <DollarSign className="w-4 h-4 text-primary" />
          <p className="text-sm text-muted-foreground">Market Cap</p>
        </div>
        <p className="text-xl font-bold text-foreground">
          {formatNumber(stats.total_market_cap.usd)}
        </p>
        <div className={`flex items-center gap-1 text-sm mt-1 ${isPositiveChange ? 'text-success' : 'text-destructive'}`}>
          {isPositiveChange ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          <span>{Math.abs(stats.market_cap_change_percentage_24h_usd).toFixed(2)}%</span>
        </div>
      </div>

      <div className="glass-card p-4 rounded-lg border border-border/30 hover-scale">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="w-4 h-4 text-primary" />
          <p className="text-sm text-muted-foreground">24h Volume</p>
        </div>
        <p className="text-xl font-bold text-foreground">
          {formatNumber(stats.total_volume.usd)}
        </p>
      </div>

      <div className="glass-card p-4 rounded-lg border border-border/30 hover-scale">
        <div className="flex items-center gap-2 mb-2">
          <img src="https://coin-images.coingecko.com/coins/images/1/small/bitcoin.png" alt="BTC" className="w-4 h-4" />
          <p className="text-sm text-muted-foreground">BTC Dominance</p>
        </div>
        <p className="text-xl font-bold text-foreground">
          {stats.market_cap_percentage.btc.toFixed(1)}%
        </p>
      </div>

      <div className="glass-card p-4 rounded-lg border border-border/30 hover-scale">
        <div className="flex items-center gap-2 mb-2">
          <img src="https://coin-images.coingecko.com/coins/images/279/small/ethereum.png" alt="ETH" className="w-4 h-4" />
          <p className="text-sm text-muted-foreground">ETH Dominance</p>
        </div>
        <p className="text-xl font-bold text-foreground">
          {stats.market_cap_percentage.eth.toFixed(1)}%
        </p>
      </div>
    </div>
  );
};
