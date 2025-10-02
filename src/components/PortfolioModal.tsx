import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePortfolio } from "@/hooks/usePortfolio";
import { CryptoData } from "@/hooks/useCryptoData";
import { Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  cryptoData: CryptoData[];
}

export const PortfolioModal = ({ isOpen, onClose, cryptoData }: PortfolioModalProps) => {
  const { portfolio, addToPortfolio, removeFromPortfolio } = usePortfolio();
  const { toast } = useToast();
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [amount, setAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");

  const handleAdd = () => {
    if (!selectedCrypto || !amount || !buyPrice) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    addToPortfolio(selectedCrypto, parseFloat(amount), parseFloat(buyPrice));
    toast({
      title: "Added to portfolio",
      description: "Cryptocurrency added successfully",
    });
    setSelectedCrypto("");
    setAmount("");
    setBuyPrice("");
  };

  const calculateProfit = (item: { id: string; amount: number; buyPrice: number }) => {
    const crypto = cryptoData.find(c => c.id === item.id);
    if (!crypto) return { profit: 0, profitPercent: 0 };
    
    const currentValue = crypto.current_price * item.amount;
    const investedValue = item.buyPrice * item.amount;
    const profit = currentValue - investedValue;
    const profitPercent = ((profit / investedValue) * 100);
    
    return { profit, profitPercent };
  };

  const totalValue = portfolio.reduce((acc, item) => {
    const crypto = cryptoData.find(c => c.id === item.id);
    return acc + (crypto ? crypto.current_price * item.amount : 0);
  }, 0);

  const totalInvested = portfolio.reduce((acc, item) => {
    return acc + (item.buyPrice * item.amount);
  }, 0);

  const totalProfit = totalValue - totalInvested;
  const totalProfitPercent = totalInvested > 0 ? (totalProfit / totalInvested) * 100 : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-border/50 max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">My Portfolio</DialogTitle>
        </DialogHeader>

        {/* Summary */}
        {portfolio.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass-card p-4 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground mb-1">Total Value</p>
              <p className="text-xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
            </div>
            <div className="glass-card p-4 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground mb-1">Total Invested</p>
              <p className="text-xl font-bold text-foreground">${totalInvested.toLocaleString()}</p>
            </div>
            <div className="glass-card p-4 rounded-lg border border-border/30">
              <p className="text-sm text-muted-foreground mb-1">Total P/L</p>
              <p className={`text-xl font-bold ${totalProfit >= 0 ? 'text-success' : 'text-destructive'}`}>
                ${totalProfit.toLocaleString()} ({totalProfitPercent.toFixed(2)}%)
              </p>
            </div>
          </div>
        )}

        {/* Add New */}
        <div className="glass-card p-4 rounded-lg border border-border/30 space-y-4">
          <h3 className="font-semibold text-foreground">Add to Portfolio</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label htmlFor="crypto">Cryptocurrency</Label>
              <select
                id="crypto"
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
                className="w-full h-10 px-3 rounded-md border border-border bg-background text-foreground"
              >
                <option value="">Select...</option>
                {cryptoData.map(crypto => (
                  <option key={crypto.id} value={crypto.id}>
                    {crypto.name} ({crypto.symbol.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="buyPrice">Buy Price</Label>
              <Input
                id="buyPrice"
                type="number"
                step="any"
                value={buyPrice}
                onChange={(e) => setBuyPrice(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
          <Button onClick={handleAdd} className="w-full gap-2">
            <Plus size={16} />
            Add to Portfolio
          </Button>
        </div>

        {/* Portfolio Items */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Your Holdings</h3>
          {portfolio.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No holdings yet. Add cryptocurrencies to start tracking your portfolio.
            </p>
          ) : (
            portfolio.map(item => {
              const crypto = cryptoData.find(c => c.id === item.id);
              if (!crypto) return null;
              
              const { profit, profitPercent } = calculateProfit(item);
              const currentValue = crypto.current_price * item.amount;
              
              return (
                <div key={item.id} className="glass-card p-4 rounded-lg border border-border/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <img src={crypto.image} alt={crypto.name} className="w-10 h-10 rounded-full" />
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{crypto.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.amount} {crypto.symbol.toUpperCase()} @ ${item.buyPrice.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-semibold text-foreground">${currentValue.toLocaleString()}</p>
                      <p className={`text-sm ${profit >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {profit >= 0 ? '+' : ''}{profit.toLocaleString()} ({profitPercent.toFixed(2)}%)
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromPortfolio(item.id)}
                      className="flex-shrink-0"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
