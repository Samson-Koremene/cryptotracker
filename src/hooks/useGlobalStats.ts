import { useQuery } from "@tanstack/react-query";

export interface GlobalStats {
  active_cryptocurrencies: number;
  markets: number;
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number; eth: number };
  market_cap_change_percentage_24h_usd: number;
}

const fetchGlobalStats = async (): Promise<GlobalStats> => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/global"
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch global stats");
  }
  
  const data = await response.json();
  return data.data;
};

export const useGlobalStats = () => {
  return useQuery({
    queryKey: ["global-stats"],
    queryFn: fetchGlobalStats,
    refetchInterval: 60000, // Refetch every minute
  });
};
