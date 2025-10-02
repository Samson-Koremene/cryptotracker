import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TrendingUp, TrendingDown } from "lucide-react";
import { CryptoChart } from "@/components/CryptoChart";

interface CryptoDetailModalProps {
  crypto: {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number;
    price_change_percentage_24h: number;
    market_cap: number;
    total_volume: number;
    high_24h?: number;
    low_24h?: number;
    ath?: number;
    atl?: number;
    circulating_supply?: number;
    max_supply?: number;
  } | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CryptoDetailModal = ({ crypto, isOpen, onClose }: CryptoDetailModalProps) => {
  if (!crypto) return null;

  const isPositive = crypto.price_change_percentage_24h >= 0;
  const priceChangeClass = isPositive ? "price-up" : "price-down";

  const formatNumber = (num: number | undefined) => {
    if (!num) return "N/A";
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  const formatSupply = (num: number | undefined) => {
    if (!num) return "N/A";
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(2)}K`;
    return num.toFixed(0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-border/50 max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <img src={crypto.image} alt={crypto.name} className="w-16 h-16 rounded-full" />
            <div>
              <DialogTitle className="text-2xl text-foreground">{crypto.name}</DialogTitle>
              <DialogDescription className="text-muted-foreground uppercase text-lg">
                {crypto.symbol}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Chart Section */}
          <div className="glass-card p-4 rounded-lg border border-border/30">
            <h4 className="text-sm font-semibold text-foreground mb-4">Price Chart</h4>
            <CryptoChart coinId={crypto.id} isPositive={isPositive} />
          </div>

          {/* Price Section */}
          <div className="space-y-2">
            <div className="flex items-end gap-3">
              <h3 className="text-4xl font-bold text-foreground">
                ${crypto.current_price.toLocaleString()}
              </h3>
              <div className={`flex items-center gap-1 ${priceChangeClass} font-semibold text-lg mb-1`}>
                {isPositive ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                <span>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
              </div>
            </div>
          </div>

          {/* Market Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="glass-card p-4 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground mb-1">Market Cap</p>
              <p className="text-xl font-bold text-foreground">{formatNumber(crypto.market_cap)}</p>
            </div>
            <div className="glass-card p-4 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground mb-1">24h Volume</p>
              <p className="text-xl font-bold text-foreground">{formatNumber(crypto.total_volume)}</p>
            </div>
            <div className="glass-card p-4 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground mb-1">24h High</p>
              <p className="text-xl font-bold text-success">{formatNumber(crypto.high_24h)}</p>
            </div>
            <div className="glass-card p-4 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground mb-1">24h Low</p>
              <p className="text-xl font-bold text-destructive">{formatNumber(crypto.low_24h)}</p>
            </div>
            <div className="glass-card p-4 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground mb-1">All-Time High</p>
              <p className="text-xl font-bold text-foreground">{formatNumber(crypto.ath)}</p>
            </div>
            <div className="glass-card p-4 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground mb-1">All-Time Low</p>
              <p className="text-xl font-bold text-foreground">{formatNumber(crypto.atl)}</p>
            </div>
          </div>

          {/* Supply Section */}
          <div className="glass-card p-4 rounded-lg border border-border/30">
            <h4 className="text-sm text-muted-foreground mb-3">Supply Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Circulating Supply</p>
                <p className="text-lg font-semibold text-foreground">{formatSupply(crypto.circulating_supply)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Max Supply</p>
                <p className="text-lg font-semibold text-foreground">{formatSupply(crypto.max_supply)}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
