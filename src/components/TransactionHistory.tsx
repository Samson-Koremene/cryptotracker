import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useTransactionHistory } from "@/hooks/useTransactionHistory";
import { CryptoData } from "@/hooks/useCryptoData";
import { History, Trash2, Plus, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TransactionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  cryptoData: CryptoData[];
}

export const TransactionHistory = ({ isOpen, onClose, cryptoData }: TransactionHistoryProps) => {
  const { transactions, addTransaction, removeTransaction } = useTransactionHistory();
  const { toast } = useToast();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [type, setType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");

  const handleAddTransaction = () => {
    if (!selectedCrypto || !amount || !price) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const crypto = cryptoData.find((c) => c.id === selectedCrypto);
    if (!crypto) return;

    addTransaction({
      cryptoId: crypto.id,
      cryptoName: crypto.name,
      symbol: crypto.symbol,
      type,
      amount: parseFloat(amount),
      price: parseFloat(price),
      date,
      notes,
    });

    toast({
      title: "Transaction added",
      description: `${type === "buy" ? "Bought" : "Sold"} ${amount} ${crypto.symbol.toUpperCase()}`,
    });

    // Reset form
    setSelectedCrypto("");
    setAmount("");
    setPrice("");
    setNotes("");
    setShowAddForm(false);
  };

  const totalValue = transactions.reduce((sum, t) => {
    return sum + (t.type === "buy" ? t.amount * t.price : -t.amount * t.price);
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Transaction History
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">Total Transactions</div>
              <div className="text-2xl font-bold">{transactions.length}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Net Investment</div>
              <div className={`text-2xl font-bold ${totalValue >= 0 ? "text-green-500" : "text-red-500"}`}>
                ${Math.abs(totalValue).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <Button onClick={() => setShowAddForm(!showAddForm)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>

          {showAddForm && (
            <div className="p-4 border rounded-lg space-y-4">
              <h3 className="font-semibold">New Transaction</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Cryptocurrency</Label>
                  <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select crypto" />
                    </SelectTrigger>
                    <SelectContent>
                      {cryptoData.map((crypto) => (
                        <SelectItem key={crypto.id} value={crypto.id}>
                          {crypto.name} ({crypto.symbol.toUpperCase()})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Type</Label>
                  <Select value={type} onValueChange={(v: "buy" | "sell") => setType(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy">Buy</SelectItem>
                      <SelectItem value="sell">Sell</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Amount</Label>
                  <Input
                    type="number"
                    step="0.00000001"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label>Price per Unit ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any notes about this transaction"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddTransaction}>Add Transaction</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-2">
            {transactions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No transactions yet. Add your first transaction above.
              </p>
            ) : (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="p-4 border rounded-lg flex items-start justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex gap-3 flex-1">
                    {transaction.type === "buy" ? (
                      <ArrowDownCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                    ) : (
                      <ArrowUpCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium">
                        {transaction.type === "buy" ? "Bought" : "Sold"} {transaction.cryptoName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.amount} {transaction.symbol.toUpperCase()} @ ${transaction.price.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {new Date(transaction.date).toLocaleDateString()} • Total: ${(transaction.amount * transaction.price).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      {transaction.notes && (
                        <div className="text-sm text-muted-foreground mt-2 italic">
                          {transaction.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTransaction(transaction.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
