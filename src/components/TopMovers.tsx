import { CryptoData } from "@/hooks/useCryptoData";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TopMoversProps {
  cryptoData: CryptoData[];
  onCryptoClick: (crypto: CryptoData) => void;
}

export const TopMovers = ({ cryptoData, onCryptoClick }: TopMoversProps) => {
  const gainers = [...cryptoData]
    .sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    .slice(0, 5);

  const losers = [...cryptoData]
    .sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h)
    .slice(0, 5);

  const MoverCard = ({ crypto }: { crypto: CryptoData }) => {
    const isPositive = crypto.price_change_percentage_24h >= 0;
    
    return (
      <button
        onClick={() => onCryptoClick(crypto)}
        className="glass-card p-3 rounded-lg border border-border/30 hover:border-primary/50 transition-all w-full text-left hover-scale"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground truncate">{crypto.symbol.toUpperCase()}</p>
              <p className="text-xs text-muted-foreground truncate">{crypto.name}</p>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <p className="font-semibold text-foreground">${crypto.current_price.toLocaleString()}</p>
            <div className={`flex items-center gap-1 text-sm justify-end ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-foreground mb-4">Top Movers</h2>
      <Tabs defaultValue="gainers" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="gainers" className="gap-2">
            <TrendingUp size={16} />
            Top Gainers
          </TabsTrigger>
          <TabsTrigger value="losers" className="gap-2">
            <TrendingDown size={16} />
            Top Losers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="gainers" className="space-y-3 mt-4">
          {gainers.map((crypto) => (
            <MoverCard key={crypto.id} crypto={crypto} />
          ))}
        </TabsContent>
        <TabsContent value="losers" className="space-y-3 mt-4">
          {losers.map((crypto) => (
            <MoverCard key={crypto.id} crypto={crypto} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};
