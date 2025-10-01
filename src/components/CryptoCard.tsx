import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CryptoCardProps {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
  onClick?: () => void;
}

export const CryptoCard = ({
  id,
  name,
  symbol,
  image,
  current_price,
  price_change_percentage_24h,
  market_cap,
  total_volume,
  isFavorite = false,
  onToggleFavorite,
  onClick,
}: CryptoCardProps) => {
  const isPositive = price_change_percentage_24h >= 0;
  const priceChangeClass = isPositive ? "price-up" : "price-down";
  const glowClass = isPositive ? "glow-success" : "glow-danger";

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <Card className={`glass-card p-6 hover:scale-105 transition-all duration-300 ${glowClass} group cursor-pointer relative`}>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 z-10 hover:scale-110 transition-transform"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite?.(id);
        }}
      >
        <Star 
          size={20} 
          className={isFavorite ? "fill-primary text-primary" : "text-muted-foreground"} 
        />
      </Button>

      <div onClick={onClick}>
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img src={image} alt={name} className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="font-bold text-lg text-foreground">{name}</h3>
              <p className="text-sm text-muted-foreground uppercase">{symbol}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 ${priceChangeClass} font-semibold`}>
            {isPositive ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
            <span>{Math.abs(price_change_percentage_24h).toFixed(2)}%</span>
          </div>
        </div>

      <div className="space-y-3">
        <div>
          <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
            ${current_price.toLocaleString()}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-border/50">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
            <p className="text-sm font-semibold text-foreground">{formatNumber(market_cap)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Volume 24h</p>
            <p className="text-sm font-semibold text-foreground">{formatNumber(total_volume)}</p>
          </div>
        </div>
      </div>
      </div>
    </Card>
  );
};
