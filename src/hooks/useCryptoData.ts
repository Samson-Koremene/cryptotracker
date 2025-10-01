import { useQuery } from "@tanstack/react-query";

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  total_volume: number;
}

const fetchCryptoData = async (): Promise<CryptoData[]> => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false"
  );
  
  if (!response.ok) {
    throw new Error("Failed to fetch crypto data");
  }
  
  return response.json();
};

export const useCryptoData = () => {
  return useQuery({
    queryKey: ["crypto-data"],
    queryFn: fetchCryptoData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });
};
