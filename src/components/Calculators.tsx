import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, TrendingUp, DollarSign } from "lucide-react";

export const Calculators = () => {
  // DCA Calculator
  const [dcaInvestment, setDcaInvestment] = useState(100);
  const [dcaFrequency, setDcaFrequency] = useState(12);
  const [dcaYears, setDcaYears] = useState(1);
  const [dcaReturn, setDcaReturn] = useState(10);

  const calculateDCA = () => {
    const monthlyInvestments = dcaYears * dcaFrequency;
    const totalInvested = dcaInvestment * monthlyInvestments;
    const monthlyRate = dcaReturn / 100 / dcaFrequency;
    const futureValue = dcaInvestment * ((Math.pow(1 + monthlyRate, monthlyInvestments) - 1) / monthlyRate) * (1 + monthlyRate);
    return { totalInvested, futureValue, profit: futureValue - totalInvested };
  };

  // Profit/Loss Calculator
  const [buyPrice, setBuyPrice] = useState(0);
  const [sellPrice, setSellPrice] = useState(0);
  const [amount, setAmount] = useState(0);

  const calculateProfitLoss = () => {
    const profit = (sellPrice - buyPrice) * amount;
    const percentage = buyPrice > 0 ? ((sellPrice - buyPrice) / buyPrice) * 100 : 0;
    return { profit, percentage };
  };

  // Price Calculator
  const [currentPrice, setCurrentPrice] = useState(0);
  const [targetMarketCap, setTargetMarketCap] = useState(0);
  const [circulatingSupply, setCirculatingSupply] = useState(0);

  const calculateTargetPrice = () => {
    return circulatingSupply > 0 ? targetMarketCap / circulatingSupply : 0;
  };

  const dcaResults = calculateDCA();
  const plResults = calculateProfitLoss();
  const targetPrice = calculateTargetPrice();

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Trading Calculators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dca" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dca">DCA</TabsTrigger>
            <TabsTrigger value="pl">Profit/Loss</TabsTrigger>
            <TabsTrigger value="price">Target Price</TabsTrigger>
          </TabsList>

          {/* DCA Calculator */}
          <TabsContent value="dca" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>Investment Amount ($)</Label>
                <Input
                  type="number"
                  value={dcaInvestment}
                  onChange={(e) => setDcaInvestment(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Frequency (per year)</Label>
                <Input
                  type="number"
                  value={dcaFrequency}
                  onChange={(e) => setDcaFrequency(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Years</Label>
                <Input
                  type="number"
                  value={dcaYears}
                  onChange={(e) => setDcaYears(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Expected Annual Return (%)</Label>
                <Input
                  type="number"
                  value={dcaReturn}
                  onChange={(e) => setDcaReturn(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Invested:</span>
                <span className="font-semibold">${dcaResults.totalInvested.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Future Value:</span>
                <span className="font-semibold">${dcaResults.futureValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit:</span>
                <span className={`font-semibold ${dcaResults.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ${dcaResults.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </TabsContent>

          {/* Profit/Loss Calculator */}
          <TabsContent value="pl" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>Buy Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={buyPrice}
                  onChange={(e) => setBuyPrice(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Sell Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={sellPrice}
                  onChange={(e) => setSellPrice(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Profit/Loss:</span>
                <span className={`font-semibold ${plResults.profit >= 0 ? "text-green-500" : "text-red-500"}`}>
                  ${plResults.profit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Percentage:</span>
                <span className={`font-semibold ${plResults.percentage >= 0 ? "text-green-500" : "text-red-500"}`}>
                  {plResults.percentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </TabsContent>

          {/* Target Price Calculator */}
          <TabsContent value="price" className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>Current Price ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Target Market Cap ($)</Label>
                <Input
                  type="number"
                  value={targetMarketCap}
                  onChange={(e) => setTargetMarketCap(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <Label>Circulating Supply</Label>
                <Input
                  type="number"
                  value={circulatingSupply}
                  onChange={(e) => setCirculatingSupply(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Target Price:</span>
                <span className="font-semibold">${targetPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
              </div>
              {currentPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Potential Gain:</span>
                  <span className={`font-semibold ${targetPrice - currentPrice >= 0 ? "text-green-500" : "text-red-500"}`}>
                    {(((targetPrice - currentPrice) / currentPrice) * 100).toFixed(2)}%
                  </span>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
