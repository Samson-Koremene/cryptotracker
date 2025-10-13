import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePriceAlerts } from "@/hooks/usePriceAlerts";
import { CryptoData } from "@/hooks/useCryptoData";
import { Bell, Trash2, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PriceAlertsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cryptoData: CryptoData[];
}

export const PriceAlertsModal = ({ isOpen, onClose, cryptoData }: PriceAlertsModalProps) => {
  const { alerts, addAlert, removeAlert, resetAlert } = usePriceAlerts();
  const { toast } = useToast();
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [targetPrice, setTargetPrice] = useState("");
  const [condition, setCondition] = useState<"above" | "below">("above");

  const handleAddAlert = () => {
    if (!selectedCrypto || !targetPrice) {
      toast({
        title: "Missing information",
        description: "Please select a cryptocurrency and enter a target price",
        variant: "destructive",
      });
      return;
    }

    const crypto = cryptoData.find((c) => c.id === selectedCrypto);
    if (!crypto) return;

    addAlert({
      cryptoId: crypto.id,
      cryptoName: crypto.name,
      targetPrice: parseFloat(targetPrice),
      condition,
    });

    toast({
      title: "Alert created",
      description: `You'll be notified when ${crypto.name} goes ${condition} $${targetPrice}`,
    });

    setSelectedCrypto("");
    setTargetPrice("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Price Alerts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Alert */}
          <div className="space-y-4 p-4 border rounded-lg">
            <h3 className="font-semibold">Create New Alert</h3>
            <div className="grid gap-4">
              <div>
                <Label>Cryptocurrency</Label>
                <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select cryptocurrency" />
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Condition</Label>
                  <Select value={condition} onValueChange={(v: "above" | "below") => setCondition(v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="above">Above</SelectItem>
                      <SelectItem value="below">Below</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Target Price ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <Button onClick={handleAddAlert}>Add Alert</Button>
            </div>
          </div>

          {/* Active Alerts */}
          <div>
            <h3 className="font-semibold mb-3">Active Alerts ({alerts.length})</h3>
            <div className="space-y-2">
              {alerts.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No alerts set. Create one above to get notified when prices hit your targets.
                </p>
              ) : (
                alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-4 border rounded-lg flex items-center justify-between ${
                      alert.triggered ? "bg-green-500/10 border-green-500/50" : ""
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium flex items-center gap-2">
                        {alert.cryptoName}
                        {alert.triggered && <CheckCircle2 className="w-4 h-4 text-green-500" />}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Alert when price goes {alert.condition} ${alert.targetPrice.toLocaleString()}
                      </div>
                      {alert.triggered && (
                        <div className="text-sm text-green-500 font-medium mt-1">
                          Alert triggered!
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {alert.triggered && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resetAlert(alert.id)}
                        >
                          Reset
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => removeAlert(alert.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
