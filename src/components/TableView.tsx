import { CryptoData } from "@/hooks/useCryptoData";
import { TrendingUp, TrendingDown, Star } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableViewProps {
  data: CryptoData[];
  onCryptoClick: (crypto: CryptoData) => void;
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (id: string) => void;
}

export const TableView = ({ data, onCryptoClick, isFavorite, onToggleFavorite }: TableViewProps) => {
  const formatNumber = (num: number) => {
    if (num >= 1e9) return `$${(num / 1e9).toFixed(2)}B`;
    if (num >= 1e6) return `$${(num / 1e6).toFixed(2)}M`;
    if (num >= 1e3) return `$${(num / 1e3).toFixed(2)}K`;
    return `$${num.toFixed(2)}`;
  };

  return (
    <div className="glass-card rounded-lg border border-border/30 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border/50">
            <TableHead className="w-12"></TableHead>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">24h Change</TableHead>
            <TableHead className="text-right">Market Cap</TableHead>
            <TableHead className="text-right">Volume</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((crypto) => {
            const isPositive = crypto.price_change_percentage_24h >= 0;
            return (
              <TableRow 
                key={crypto.id}
                className="border-border/50 hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={() => onCryptoClick(crypto)}
              >
                <TableCell>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(crypto.id);
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    <Star
                      size={16}
                      className={isFavorite(crypto.id) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}
                    />
                  </button>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img src={crypto.image} alt={crypto.name} className="w-8 h-8 rounded-full" />
                    <div>
                      <p className="font-semibold text-foreground">{crypto.name}</p>
                      <p className="text-sm text-muted-foreground uppercase">{crypto.symbol}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right font-semibold text-foreground">
                  ${crypto.current_price.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className={`flex items-center gap-1 justify-end font-semibold ${isPositive ? 'text-success' : 'text-destructive'}`}>
                    {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span>{Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-right text-foreground">
                  {formatNumber(crypto.market_cap)}
                </TableCell>
                <TableCell className="text-right text-foreground">
                  {formatNumber(crypto.total_volume)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
