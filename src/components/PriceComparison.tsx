import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CryptoData } from "@/hooks/useCryptoData";
import { useCryptoChart } from "@/hooks/useCryptoChart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { GitCompare } from "lucide-react";

interface PriceComparisonProps {
  cryptoData: CryptoData[];
}

export const PriceComparison = ({ cryptoData }: PriceComparisonProps) => {
  const [crypto1, setCrypto1] = useState("");
  const [crypto2, setCrypto2] = useState("");
  const [days, setDays] = useState(7);

  const { data: chart1 } = useCryptoChart(crypto1, days);
  const { data: chart2 } = useCryptoChart(crypto2, days);

  const combinedData = chart1?.map((point, index) => {
    const crypto1Name = cryptoData.find(c => c.id === crypto1)?.symbol.toUpperCase() || "Crypto 1";
    const crypto2Name = cryptoData.find(c => c.id === crypto2)?.symbol.toUpperCase() || "Crypto 2";
    
    return {
      timestamp: point.timestamp,
      [crypto1Name]: point.price,
      [crypto2Name]: chart2?.[index]?.price || 0,
    };
  }) || [];

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="w-5 h-5" />
          Price Comparison
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Select value={crypto1} onValueChange={setCrypto1}>
              <SelectTrigger>
                <SelectValue placeholder="Select first crypto" />
              </SelectTrigger>
              <SelectContent>
                {cryptoData.map((crypto) => (
                  <SelectItem key={crypto.id} value={crypto.id}>
                    {crypto.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={crypto2} onValueChange={setCrypto2}>
              <SelectTrigger>
                <SelectValue placeholder="Select second crypto" />
              </SelectTrigger>
              <SelectContent>
                {cryptoData.map((crypto) => (
                  <SelectItem key={crypto.id} value={crypto.id}>
                    {crypto.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={days.toString()} onValueChange={(v) => setDays(parseInt(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">24 Hours</SelectItem>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
                <SelectItem value="90">90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {crypto1 && crypto2 && combinedData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={combinedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  tickFormatter={(timestamp) =>
                    new Date(timestamp).toLocaleDateString()
                  }
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(timestamp) =>
                    new Date(timestamp).toLocaleString()
                  }
                  formatter={(value: number) => ["$" + value.toFixed(2)]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={cryptoData.find(c => c.id === crypto1)?.symbol.toUpperCase()}
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey={cryptoData.find(c => c.id === crypto2)?.symbol.toUpperCase()}
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Select two cryptocurrencies to compare their prices
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
