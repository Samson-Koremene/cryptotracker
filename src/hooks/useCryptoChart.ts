import { useQuery } from "@tanstack/react-query";

interface ChartData {
  timestamp: number;
  price: number;
}

const fetchCryptoChart = async (coinId: string, days: number = 7): Promise<ChartData[]> => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch chart data");
  }
  
  const data = await response.json();
  
  return data.prices.map(([timestamp, price]: [number, number]) => ({
    timestamp,
    price,
  }));
};

export const useCryptoChart = (coinId: string | undefined, days: number = 7) => {
  return useQuery({
    queryKey: ["crypto-chart", coinId, days],
    queryFn: () => fetchCryptoChart(coinId!, days),
    enabled: !!coinId,
    staleTime: 60000, // 1 minute
  });
};
